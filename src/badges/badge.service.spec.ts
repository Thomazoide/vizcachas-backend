import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { runInNewContext } from 'node:vm';
import ts from 'typescript';
import { describe, expect, it, vi } from 'vitest';

const require = createRequire(import.meta.url);
const { BadRequestException } = require('@nestjs/common') as typeof import('@nestjs/common');
const { EntityNotFoundError, IsNull } = require('typeorm') as typeof import('typeorm');
type Service = Record<string, (...args: unknown[]) => Promise<unknown>>;

// Compile legacy parameter decorators in memory and isolate entity relations from these unit tests.
function loadService(directory: string, name: string, entity: string) {
    const source = readFileSync(new URL(`../${directory}/${name}.service.ts`, import.meta.url), 'utf8');
    const compiled = ts.transpileModule(source, {
        compilerOptions: {
            module: ts.ModuleKind.CommonJS,
            target: ts.ScriptTarget.ES2023,
            experimentalDecorators: true,
            emitDecoratorMetadata: true
        }
    }).outputText;
    const exports: Record<string, new (repo: unknown) => Service> = {};
    runInNewContext(compiled, {
        exports,
        require: (specifier: string) => {
            if (specifier === `../models/${name}.model.js`) return { [entity]: class {} };
            if (specifier === '@nestjs/typeorm') return { InjectRepository: () => () => {} };
            return require(specifier);
        }
    });
    return exports[`${entity}Service`];
}

const cases = [
    { directory: 'badges', name: 'badge', entity: 'Badge', soft: true },
    { directory: 'user-badges', name: 'user-badge', entity: 'UserBadge', soft: false },
    { directory: 'trivia-badges', name: 'trivia-badge', entity: 'TriviaBadge', soft: false },
    { directory: 'trivia-completions', name: 'trivia-completion', entity: 'TriviaCompletion', soft: true }
];

describe.each(cases)('$entity CRUD', ({ directory, name, entity, soft }) => {
    const ServiceClass = loadService(directory, name, entity);
    function setup() {
        const repo = {
            find: vi.fn(), findOne: vi.fn(), create: vi.fn(), save: vi.fn(),
            merge: vi.fn(), softDelete: vi.fn(), remove: vi.fn()
        };
        return { repo, service: new ServiceClass(repo) };
    }

    it('lists without loading relations and filters soft-deleted entities', async () => {
        const { repo, service } = setup();
        const rows = [{ ID: 'id' }];
        repo.find.mockResolvedValue(rows);
        expect(await service[`GetAll${entity}s`]()).toBe(rows);
        if (soft) expect(repo.find).toHaveBeenCalledExactlyOnceWith({ where: { deleted_at: IsNull() } });
        else expect(repo.find).toHaveBeenCalledExactlyOnceWith();
    });

    it('creates through the repository without assigning dates or relations', async () => {
        const { repo, service } = setup();
        const data = {};
        const created = {};
        const saved = { ID: 'id' };
        repo.create.mockReturnValue(created);
        repo.save.mockResolvedValue(saved);
        expect(await service[`Create${entity}`](data)).toBe(saved);
        expect(repo.create).toHaveBeenCalledExactlyOnceWith(data);
        expect(repo.save).toHaveBeenCalledExactlyOnceWith(created);
        expect(created).toEqual({});
    });

    it('loads an entity by ID', async () => {
        const { repo, service } = setup();
        const existing = { ID: 'id' };
        repo.findOne.mockResolvedValue(existing);
        expect(await service.FindByID('id')).toBe(existing);
        expect(repo.findOne).toHaveBeenCalledExactlyOnceWith({ where: { ID: 'id' } });
    });

    it('merges partial updates into the existing entity before saving', async () => {
        const { repo, service } = setup();
        const existing = { ID: 'id', created_at: new Date() };
        const data = { ID: 'id' };
        const merged = { ...existing };
        repo.findOne.mockResolvedValue(existing);
        repo.merge.mockReturnValue(merged);
        repo.save.mockResolvedValue(merged);
        expect(await service[`Update${entity}`](data)).toBe(merged);
        expect(repo.findOne).toHaveBeenCalledExactlyOnceWith({ where: { ID: 'id' } });
        expect(repo.merge).toHaveBeenCalledExactlyOnceWith(existing, data);
        expect(repo.save).toHaveBeenCalledExactlyOnceWith(merged);
    });

    it.each([undefined, null, '', '   '])('rejects empty ID %s before any query', async (ID) => {
        const { repo, service } = setup();
        await expect(service.FindByID(ID)).rejects.toBeInstanceOf(BadRequestException);
        await expect(service[`Update${entity}`]({ ID })).rejects.toBeInstanceOf(BadRequestException);
        await expect(service[`Delete${entity}`](ID)).rejects.toBeInstanceOf(BadRequestException);
        expect(repo.findOne).not.toHaveBeenCalled();
        expect(repo.save).not.toHaveBeenCalled();
        expect(repo.remove).not.toHaveBeenCalled();
        expect(repo.softDelete).not.toHaveBeenCalled();
    });

    it('rejects missing entities without writes', async () => {
        const { repo, service } = setup();
        repo.findOne.mockResolvedValue(null);
        await expect(service.FindByID('missing')).rejects.toBeInstanceOf(EntityNotFoundError);
        await expect(service[`Update${entity}`]({ ID: 'missing' })).rejects.toBeInstanceOf(EntityNotFoundError);
        await expect(service[`Delete${entity}`]('missing')).rejects.toBeInstanceOf(EntityNotFoundError);
        expect(repo.merge).not.toHaveBeenCalled();
        expect(repo.save).not.toHaveBeenCalled();
        expect(repo.remove).not.toHaveBeenCalled();
        expect(repo.softDelete).not.toHaveBeenCalled();
    });

    it('checks existence and uses the deletion supported by the model', async () => {
        const { repo, service } = setup();
        const existing = { ID: 'id' };
        repo.findOne.mockResolvedValue(existing);
        await expect(service[`Delete${entity}`]('id')).resolves.toBeUndefined();
        expect(repo.findOne).toHaveBeenCalledExactlyOnceWith({ where: { ID: 'id' } });
        if (soft) {
            expect(repo.softDelete).toHaveBeenCalledExactlyOnceWith('id');
            expect(repo.remove).not.toHaveBeenCalled();
        } else {
            expect(repo.remove).toHaveBeenCalledExactlyOnceWith(existing);
            expect(repo.softDelete).not.toHaveBeenCalled();
        }
        expect(repo.save).not.toHaveBeenCalled();
    });
});

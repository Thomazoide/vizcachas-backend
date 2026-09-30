import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { runInNewContext } from 'node:vm';
import ts from 'typescript';
import { describe, expect, it, vi } from 'vitest';

const require = createRequire(import.meta.url);
const { BadRequestException } =
  require('@nestjs/common') as typeof import('@nestjs/common');
const { EntityNotFoundError, IsNull } =
  require('typeorm') as typeof import('typeorm');

type Service = Record<string, (...args: unknown[]) => Promise<unknown>>;

// TypeScript compila los parameter decorators en memoria; los modelos se aíslan
// para no cargar su grafo de relaciones ni necesitar una conexión a la DB.
function loadService(directory: string, name: string, entity: string) {
  const source = readFileSync(
    new URL(`../${directory}/${name}.service.ts`, import.meta.url),
    'utf8',
  );
  const compiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2023,
      experimentalDecorators: true,
      emitDecoratorMetadata: true,
    },
  }).outputText;
  const exports: Record<string, new (repo: unknown) => Service> = {};
  runInNewContext(compiled, {
    exports,
    require: (specifier: string) => {
      if (specifier === `../models/${name}.model.js`)
        return { [entity]: class {} };
      if (specifier === '@nestjs/typeorm')
        return { InjectRepository: () => () => {} };
      return require(specifier);
    },
  });
  return exports[`${entity}Service`];
}

describe.each([
  ['trivias', 'trivia', 'Trivia'],
  ['questions', 'question', 'Question'],
  ['alternatives', 'alternative', 'Alternative'],
])('%s CRUD', (directory, name, entity) => {
  const ServiceClass = loadService(directory, name, entity);

  function setup() {
    const repo = {
      find: vi.fn(),
      create: vi.fn(),
      save: vi.fn(),
      findOne: vi.fn(),
      merge: vi.fn(),
      softDelete: vi.fn(),
    };
    return { repo, service: new ServiceClass(repo) };
  }

  it('lista registros activos sin cargar relaciones', async () => {
    const { repo, service } = setup();
    const rows = [{ ID: 'id' }];
    repo.find.mockResolvedValue(rows);
    expect(await service[`GetAll${entity}s`]()).toBe(rows);
    expect(repo.find).toHaveBeenCalledExactlyOnceWith({
      where: { deleted_at: IsNull() },
    });
  });

  it('crea y guarda la entidad sin asignar fechas', async () => {
    const { repo, service } = setup();
    const data = { description: 'nuevo' };
    const created = { ...data };
    const saved = { ...data, ID: 'id' };
    repo.create.mockReturnValue(created);
    repo.save.mockResolvedValue(saved);
    expect(await service[`Create${entity}`](data)).toBe(saved);
    expect(repo.create).toHaveBeenCalledExactlyOnceWith(data);
    expect(repo.save).toHaveBeenCalledExactlyOnceWith(created);
    expect(created).toEqual(data);
  });

  it('busca por ID sin solicitar relaciones ni registros borrados', async () => {
    const { repo, service } = setup();
    const existing = { ID: 'id' };
    repo.findOne.mockResolvedValue(existing);
    expect(await service.FindByID('id')).toBe(existing);
    expect(repo.findOne).toHaveBeenCalledExactlyOnceWith({
      where: { ID: 'id' },
    });
  });

  it('actualiza fusionando la entidad existente antes de guardarla', async () => {
    const { repo, service } = setup();
    const existing = {
      ID: 'id',
      description: 'original',
      created_at: new Date(0),
    };
    const data = { ID: 'id', description: 'editado' };
    const merged = { ...existing, ...data };
    repo.findOne.mockResolvedValue(existing);
    repo.merge.mockReturnValue(merged);
    repo.save.mockResolvedValue(merged);
    expect(await service[`Update${entity}`](data)).toBe(merged);
    expect(repo.findOne).toHaveBeenCalledExactlyOnceWith({
      where: { ID: 'id' },
    });
    expect(repo.merge).toHaveBeenCalledExactlyOnceWith(existing, data);
    expect(repo.save).toHaveBeenCalledExactlyOnceWith(merged);
  });

  it('espera la comprobación de existencia antes del softDelete', async () => {
    const { repo, service } = setup();
    let resolveFind!: (value: { ID: string }) => void;
    repo.findOne.mockReturnValue(
      new Promise((resolve) => {
        resolveFind = resolve;
      }),
    );
    const deletion = service[`Delete${entity}`]('id');
    expect(repo.softDelete).not.toHaveBeenCalled();
    resolveFind({ ID: 'id' });
    await expect(deletion).resolves.toBeUndefined();
    expect(repo.softDelete).toHaveBeenCalledExactlyOnceWith('id');
    expect(repo.save).not.toHaveBeenCalled();
  });

  it.each([undefined, null, '', '   '])(
    'rechaza ID vacío (%s) antes de consultar',
    async (ID) => {
      const { repo, service } = setup();
      await expect(service[`Update${entity}`]({ ID })).rejects.toBeInstanceOf(
        BadRequestException,
      );
      await expect(service.FindByID(ID)).rejects.toBeInstanceOf(
        BadRequestException,
      );
      await expect(service[`Delete${entity}`](ID)).rejects.toBeInstanceOf(
        BadRequestException,
      );
      expect(repo.findOne).not.toHaveBeenCalled();
      expect(repo.merge).not.toHaveBeenCalled();
      expect(repo.save).not.toHaveBeenCalled();
      expect(repo.softDelete).not.toHaveBeenCalled();
    },
  );

  it.each(['FindByID', `Update${entity}`, `Delete${entity}`])(
    '%s rechaza entidades inexistentes sin escribir',
    async (method) => {
      const { repo, service } = setup();
      repo.findOne.mockResolvedValue(null);
      const argument =
        method === `Update${entity}` ? { ID: 'missing' } : 'missing';
      await expect(service[method](argument)).rejects.toBeInstanceOf(
        EntityNotFoundError,
      );
      expect(repo.merge).not.toHaveBeenCalled();
      expect(repo.save).not.toHaveBeenCalled();
      expect(repo.softDelete).not.toHaveBeenCalled();
    },
  );

  it('propaga errores de softDelete', async () => {
    const { repo, service } = setup();
    repo.findOne.mockResolvedValue({ ID: 'id' });
    const failure = new Error('delete failed');
    repo.softDelete.mockRejectedValue(failure);
    await expect(service[`Delete${entity}`]('id')).rejects.toBe(failure);
  });

  it.each([`Create${entity}`, `Update${entity}`])(
    '%s propaga errores de save',
    async (method) => {
      const { repo, service } = setup();
      repo.findOne.mockResolvedValue({ ID: 'id' });
      const failure = new Error('save failed');
      repo.save.mockRejectedValue(failure);
      await expect(service[method]({ ID: 'id' })).rejects.toBe(failure);
    },
  );
});

import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityNotFoundError, Repository } from "typeorm";
import { TriviaBadge } from "../models/trivia-badge.model.js";

@Injectable()
export class TriviaBadgeService {
    constructor(
        @InjectRepository(TriviaBadge)
        private readonly repo: Repository<TriviaBadge>
    ) {};

    async GetAllTriviaBadges(): Promise<TriviaBadge[]> {
        return await this.repo.find();
    }

    async CreateTriviaBadge(data: Partial<TriviaBadge>): Promise<TriviaBadge> {
        const entity = this.repo.create(data);
        return await this.repo.save(entity);
    }

    async UpdateTriviaBadge(data: Partial<TriviaBadge>): Promise<TriviaBadge> {
        if (!data.ID?.trim()) throw new BadRequestException("ID no puede estar vacío");
        const existing = await this.FindByID(data.ID);
        return await this.repo.save(this.repo.merge(existing, data));
    }

    async DeleteTriviaBadge(ID: string): Promise<void> {
        const existing = await this.FindByID(ID);
        await this.repo.remove(existing);
    }

    async FindByID(ID: string): Promise<TriviaBadge> {
        if (!ID?.trim()) throw new BadRequestException("ID no puede estar vacío");
        const existing = await this.repo.findOne({ where: { ID } });
        if (!existing) throw new EntityNotFoundError(TriviaBadge, { ID });
        return existing;
    }
}

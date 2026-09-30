import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityNotFoundError, IsNull, Repository } from "typeorm";
import { Badge } from "../models/badge.model.js";

@Injectable()
export class BadgeService {
    constructor(
        @InjectRepository(Badge)
        private readonly repo: Repository<Badge>
    ) {};

    async GetAllBadges(): Promise<Badge[]> {
        return await this.repo.find({ where: { deleted_at: IsNull() } });
    }

    async CreateBadge(data: Partial<Badge>): Promise<Badge> {
        const entity = this.repo.create(data);
        return await this.repo.save(entity);
    }

    async UpdateBadge(data: Partial<Badge>): Promise<Badge> {
        if (!data.ID?.trim()) throw new BadRequestException("ID no puede estar vacío");
        const existing = await this.FindByID(data.ID);
        return await this.repo.save(this.repo.merge(existing, data));
    }

    async DeleteBadge(ID: string): Promise<void> {
        const existing = await this.FindByID(ID);
        await this.repo.softDelete(existing.ID);
    }

    async FindByID(ID: string): Promise<Badge> {
        if (!ID?.trim()) throw new BadRequestException("ID no puede estar vacío");
        const existing = await this.repo.findOne({ where: { ID } });
        if (!existing) throw new EntityNotFoundError(Badge, { ID });
        return existing;
    }
}

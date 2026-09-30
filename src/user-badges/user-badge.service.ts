import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityNotFoundError, Repository } from "typeorm";
import { UserBadge } from "../models/user-badge.model.js";

@Injectable()
export class UserBadgeService {
    constructor(
        @InjectRepository(UserBadge)
        private readonly repo: Repository<UserBadge>
    ) {};

    async GetAllUserBadges(): Promise<UserBadge[]> {
        return await this.repo.find();
    }

    async CreateUserBadge(data: Partial<UserBadge>): Promise<UserBadge> {
        const entity = this.repo.create(data);
        return await this.repo.save(entity);
    }

    async UpdateUserBadge(data: Partial<UserBadge>): Promise<UserBadge> {
        if (!data.ID?.trim()) throw new BadRequestException("ID no puede estar vacío");
        const existing = await this.FindByID(data.ID);
        return await this.repo.save(this.repo.merge(existing, data));
    }

    async DeleteUserBadge(ID: string): Promise<void> {
        const existing = await this.FindByID(ID);
        await this.repo.remove(existing);
    }

    async FindByID(ID: string): Promise<UserBadge> {
        if (!ID?.trim()) throw new BadRequestException("ID no puede estar vacío");
        const existing = await this.repo.findOne({ where: { ID } });
        if (!existing) throw new EntityNotFoundError(UserBadge, { ID });
        return existing;
    }
}

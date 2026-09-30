import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityNotFoundError, IsNull, Repository } from "typeorm";
import { TriviaCompletion } from "../models/trivia-completion.model.js";

@Injectable()
export class TriviaCompletionService {
    constructor(
        @InjectRepository(TriviaCompletion)
        private readonly repo: Repository<TriviaCompletion>
    ) {};

    async GetAllTriviaCompletions(): Promise<TriviaCompletion[]> {
        return await this.repo.find({ where: { deleted_at: IsNull() } });
    }

    async CreateTriviaCompletion(data: Partial<TriviaCompletion>): Promise<TriviaCompletion> {
        const entity = this.repo.create(data);
        return await this.repo.save(entity);
    }

    async UpdateTriviaCompletion(data: Partial<TriviaCompletion>): Promise<TriviaCompletion> {
        if (!data.ID?.trim()) throw new BadRequestException("ID no puede estar vacío");
        const existing = await this.FindByID(data.ID);
        return await this.repo.save(this.repo.merge(existing, data));
    }

    async DeleteTriviaCompletion(ID: string): Promise<void> {
        const existing = await this.FindByID(ID);
        await this.repo.softDelete(existing.ID);
    }

    async FindByID(ID: string): Promise<TriviaCompletion> {
        if (!ID?.trim()) throw new BadRequestException("ID no puede estar vacío");
        const existing = await this.repo.findOne({ where: { ID } });
        if (!existing) throw new EntityNotFoundError(TriviaCompletion, { ID });
        return existing;
    }
}

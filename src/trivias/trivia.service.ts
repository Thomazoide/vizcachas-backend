import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundError, IsNull, Repository } from 'typeorm';
import { Trivia } from '../models/trivia.model.js';

@Injectable()
export class TriviaService {
  constructor(
    @InjectRepository(Trivia)
    private readonly repo: Repository<Trivia>,
  ) {}

  async GetAllTrivias(): Promise<Trivia[]> {
    return await this.repo.find({ where: { deleted_at: IsNull() } });
  }

  async CreateTrivia(data: Partial<Trivia>): Promise<Trivia> {
    const trivia = this.repo.create(data);
    return await this.repo.save(trivia);
  }

  async UpdateTrivia(data: Partial<Trivia>): Promise<Trivia> {
    if (!data.ID?.trim()) throw new BadRequestException('ID es requerido');
    const existing = await this.FindByID(data.ID);
    return await this.repo.save(this.repo.merge(existing, data));
  }

  async DeleteTrivia(ID: string): Promise<void> {
    await this.FindByID(ID);
    await this.repo.softDelete(ID);
  }

  async FindByID(ID: string): Promise<Trivia> {
    if (!ID?.trim()) throw new BadRequestException('ID es requerido');
    const trivia = await this.repo.findOne({ where: { ID } });
    if (!trivia) throw new EntityNotFoundError(Trivia, { ID });
    return trivia;
  }
}

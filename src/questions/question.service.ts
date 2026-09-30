import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundError, IsNull, Repository } from 'typeorm';
import { Question } from '../models/question.model.js';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question)
    private readonly repo: Repository<Question>,
  ) {}

  async GetAllQuestions(): Promise<Question[]> {
    return await this.repo.find({ where: { deleted_at: IsNull() } });
  }

  async CreateQuestion(data: Partial<Question>): Promise<Question> {
    const question = this.repo.create(data);
    return await this.repo.save(question);
  }

  async UpdateQuestion(data: Partial<Question>): Promise<Question> {
    if (!data.ID?.trim()) throw new BadRequestException('ID es requerido');
    const existing = await this.FindByID(data.ID);
    return await this.repo.save(this.repo.merge(existing, data));
  }

  async DeleteQuestion(ID: string): Promise<void> {
    await this.FindByID(ID);
    await this.repo.softDelete(ID);
  }

  async FindByID(ID: string): Promise<Question> {
    if (!ID?.trim()) throw new BadRequestException('ID es requerido');
    const question = await this.repo.findOne({ where: { ID } });
    if (!question) throw new EntityNotFoundError(Question, { ID });
    return question;
  }
}

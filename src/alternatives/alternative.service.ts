import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundError, IsNull, Repository } from 'typeorm';
import { Alternative } from '../models/alternative.model.js';

@Injectable()
export class AlternativeService {
  constructor(
    @InjectRepository(Alternative)
    private readonly repo: Repository<Alternative>,
  ) {}

  async GetAllAlternatives(): Promise<Alternative[]> {
    return await this.repo.find({ where: { deleted_at: IsNull() } });
  }

  async CreateAlternative(data: Partial<Alternative>): Promise<Alternative> {
    const alternative = this.repo.create(data);
    return await this.repo.save(alternative);
  }

  async UpdateAlternative(data: Partial<Alternative>): Promise<Alternative> {
    if (!data.ID?.trim()) throw new BadRequestException('ID es requerido');
    const existing = await this.FindByID(data.ID);
    return await this.repo.save(this.repo.merge(existing, data));
  }

  async DeleteAlternative(ID: string): Promise<void> {
    await this.FindByID(ID);
    await this.repo.softDelete(ID);
  }

  async FindByID(ID: string): Promise<Alternative> {
    if (!ID?.trim()) throw new BadRequestException('ID es requerido');
    const alternative = await this.repo.findOne({ where: { ID } });
    if (!alternative) throw new EntityNotFoundError(Alternative, { ID });
    return alternative;
  }
}

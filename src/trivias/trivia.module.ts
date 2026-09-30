import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TriviaController } from './trivia.controller.js';
import { TriviaService } from './trivia.service.js';
import { Trivia } from '../models/trivia.model.js';
import { Audit } from '../models/audit.model.js';
import { AuditService } from '../audit/audit.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Trivia, Audit])],
  providers: [TriviaService, AuditService],
  controllers: [TriviaController],
})
export class TriviaModule {}

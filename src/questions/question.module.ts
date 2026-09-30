import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionController } from './question.controller.js';
import { QuestionService } from './question.service.js';
import { Question } from '../models/question.model.js';
import { Audit } from '../models/audit.model.js';
import { AuditService } from '../audit/audit.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Question, Audit])],
  providers: [QuestionService, AuditService],
  controllers: [QuestionController],
})
export class QuestionModule {}

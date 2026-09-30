import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlternativeController } from './alternative.controller.js';
import { AlternativeService } from './alternative.service.js';
import { Alternative } from '../models/alternative.model.js';
import { Audit } from '../models/audit.model.js';
import { AuditService } from '../audit/audit.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Alternative, Audit])],
  providers: [AlternativeService, AuditService],
  controllers: [AlternativeController],
})
export class AlternativeModule {}

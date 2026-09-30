import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { EntityNotFoundError } from 'typeorm';
import { AlternativeService } from './alternative.service.js';
import { ResponsePayload } from '../payloads/response.payloads.js';
import { Alternative } from '../models/alternative.model.js';
import { Audit } from '../models/audit.model.js';
import { AuditService } from '../audit/audit.service.js';

const tableName: Audit['entity_table_name'] = 'alternative';

@Controller('alternatives')
export class AlternativeController {
  constructor(
    private readonly service: AlternativeService,
    private readonly audit: AuditService,
  ) {}

  @Get()
  async GetAllAlternatives(): Promise<ResponsePayload<Alternative[]>> {
    try {
      return {
        status_code: HttpStatus.OK,
        message: 'alternativas',
        data: await this.service.GetAllAlternatives(),
        error: false,
      };
    } catch (e) {
      return this.ErrorResponse(e);
    }
  }

  @Post()
  async CreateAlternative(
    @Body() data: Partial<Alternative>,
    @Headers('uid') user_id: string,
  ): Promise<ResponsePayload<Alternative>> {
    try {
      const alternative = await this.service.CreateAlternative(data);
      await this.audit.CreateAuditReport({
        entity_ID: alternative.ID,
        entity_table_name: tableName,
        operation_type: 'C',
        user_ID: user_id,
      });
      return {
        status_code: HttpStatus.CREATED,
        message: 'alternativa creada',
        data: alternative,
        error: false,
      };
    } catch (e) {
      return this.ErrorResponse(e);
    }
  }

  @Put()
  async UpdateAlternative(
    @Body() data: Partial<Alternative>,
    @Headers('uid') user_id: string,
  ): Promise<ResponsePayload<Alternative>> {
    try {
      const alternative = await this.service.UpdateAlternative(data);
      await this.audit.CreateAuditReport({
        entity_ID: alternative.ID,
        entity_table_name: tableName,
        operation_type: 'U',
        user_ID: user_id,
      });
      return {
        status_code: HttpStatus.OK,
        message: 'alternativa actualizada',
        data: alternative,
        error: false,
      };
    } catch (e) {
      return this.ErrorResponse(e);
    }
  }

  @Get(':ID')
  async FindByID(
    @Param('ID') ID: string,
    @Headers('uid') user_id: string,
  ): Promise<ResponsePayload<Alternative>> {
    try {
      const alternative = await this.service.FindByID(ID);
      await this.audit.CreateAuditReport({
        entity_ID: alternative.ID,
        entity_table_name: tableName,
        operation_type: 'R',
        user_ID: user_id,
      });
      return {
        status_code: HttpStatus.OK,
        message: 'alternativa encontrada',
        data: alternative,
        error: false,
      };
    } catch (e) {
      return this.ErrorResponse(e);
    }
  }

  @Delete(':ID')
  async DeleteAlternative(
    @Param('ID') ID: string,
    @Headers('uid') user_id: string,
  ): Promise<ResponsePayload<undefined>> {
    try {
      await this.service.DeleteAlternative(ID);
      await this.audit.CreateAuditReport({
        entity_ID: ID,
        entity_table_name: tableName,
        operation_type: 'D',
        user_ID: user_id,
      });
      return {
        status_code: HttpStatus.OK,
        message: `Alternativa ${ID} eliminada`,
        error: false,
      };
    } catch (e) {
      return this.ErrorResponse(e);
    }
  }

  private ErrorResponse(e: unknown): ResponsePayload<never> {
    return {
      status_code:
        e instanceof BadRequestException
          ? HttpStatus.BAD_REQUEST
          : e instanceof EntityNotFoundError
            ? HttpStatus.NOT_FOUND
            : HttpStatus.BAD_REQUEST,
      message: e instanceof Error ? e.message : 'Error desconocido',
      error: true,
    };
  }
}

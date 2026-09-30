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
import { TriviaService } from './trivia.service.js';
import { ResponsePayload } from '../payloads/response.payloads.js';
import { Trivia } from '../models/trivia.model.js';
import { Audit } from '../models/audit.model.js';
import { AuditService } from '../audit/audit.service.js';

const tableName: Audit['entity_table_name'] = 'trivia';

@Controller('trivias')
export class TriviaController {
  constructor(
    private readonly service: TriviaService,
    private readonly audit: AuditService,
  ) {}

  @Get()
  async GetAllTrivias(): Promise<ResponsePayload<Trivia[]>> {
    try {
      return {
        status_code: HttpStatus.OK,
        message: 'trivias',
        data: await this.service.GetAllTrivias(),
        error: false,
      };
    } catch (e) {
      return this.ErrorResponse(e);
    }
  }

  @Post()
  async CreateTrivia(
    @Body() data: Partial<Trivia>,
    @Headers('uid') user_id: string,
  ): Promise<ResponsePayload<Trivia>> {
    try {
      const trivia = await this.service.CreateTrivia(data);
      await this.audit.CreateAuditReport({
        entity_ID: trivia.ID,
        entity_table_name: tableName,
        operation_type: 'C',
        user_ID: user_id,
      });
      return {
        status_code: HttpStatus.CREATED,
        message: 'trivia creada',
        data: trivia,
        error: false,
      };
    } catch (e) {
      return this.ErrorResponse(e);
    }
  }

  @Put()
  async UpdateTrivia(
    @Body() data: Partial<Trivia>,
    @Headers('uid') user_id: string,
  ): Promise<ResponsePayload<Trivia>> {
    try {
      const trivia = await this.service.UpdateTrivia(data);
      await this.audit.CreateAuditReport({
        entity_ID: trivia.ID,
        entity_table_name: tableName,
        operation_type: 'U',
        user_ID: user_id,
      });
      return {
        status_code: HttpStatus.OK,
        message: 'trivia actualizada',
        data: trivia,
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
  ): Promise<ResponsePayload<Trivia>> {
    try {
      const trivia = await this.service.FindByID(ID);
      await this.audit.CreateAuditReport({
        entity_ID: trivia.ID,
        entity_table_name: tableName,
        operation_type: 'R',
        user_ID: user_id,
      });
      return {
        status_code: HttpStatus.OK,
        message: 'trivia encontrada',
        data: trivia,
        error: false,
      };
    } catch (e) {
      return this.ErrorResponse(e);
    }
  }

  @Delete(':ID')
  async DeleteTrivia(
    @Param('ID') ID: string,
    @Headers('uid') user_id: string,
  ): Promise<ResponsePayload<undefined>> {
    try {
      await this.service.DeleteTrivia(ID);
      await this.audit.CreateAuditReport({
        entity_ID: ID,
        entity_table_name: tableName,
        operation_type: 'D',
        user_ID: user_id,
      });
      return {
        status_code: HttpStatus.OK,
        message: `Trivia ${ID} eliminada`,
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

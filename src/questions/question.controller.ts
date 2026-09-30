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
import { QuestionService } from './question.service.js';
import { ResponsePayload } from '../payloads/response.payloads.js';
import { Question } from '../models/question.model.js';
import { Audit } from '../models/audit.model.js';
import { AuditService } from '../audit/audit.service.js';

const tableName: Audit['entity_table_name'] = 'question';

@Controller('questions')
export class QuestionController {
  constructor(
    private readonly service: QuestionService,
    private readonly audit: AuditService,
  ) {}

  @Get()
  async GetAllQuestions(): Promise<ResponsePayload<Question[]>> {
    try {
      return {
        status_code: HttpStatus.OK,
        message: 'preguntas',
        data: await this.service.GetAllQuestions(),
        error: false,
      };
    } catch (e) {
      return this.ErrorResponse(e);
    }
  }

  @Post()
  async CreateQuestion(
    @Body() data: Partial<Question>,
    @Headers('uid') user_id: string,
  ): Promise<ResponsePayload<Question>> {
    try {
      const question = await this.service.CreateQuestion(data);
      await this.audit.CreateAuditReport({
        entity_ID: question.ID,
        entity_table_name: tableName,
        operation_type: 'C',
        user_ID: user_id,
      });
      return {
        status_code: HttpStatus.CREATED,
        message: 'pregunta creada',
        data: question,
        error: false,
      };
    } catch (e) {
      return this.ErrorResponse(e);
    }
  }

  @Put()
  async UpdateQuestion(
    @Body() data: Partial<Question>,
    @Headers('uid') user_id: string,
  ): Promise<ResponsePayload<Question>> {
    try {
      const question = await this.service.UpdateQuestion(data);
      await this.audit.CreateAuditReport({
        entity_ID: question.ID,
        entity_table_name: tableName,
        operation_type: 'U',
        user_ID: user_id,
      });
      return {
        status_code: HttpStatus.OK,
        message: 'pregunta actualizada',
        data: question,
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
  ): Promise<ResponsePayload<Question>> {
    try {
      const question = await this.service.FindByID(ID);
      await this.audit.CreateAuditReport({
        entity_ID: question.ID,
        entity_table_name: tableName,
        operation_type: 'R',
        user_ID: user_id,
      });
      return {
        status_code: HttpStatus.OK,
        message: 'pregunta encontrada',
        data: question,
        error: false,
      };
    } catch (e) {
      return this.ErrorResponse(e);
    }
  }

  @Delete(':ID')
  async DeleteQuestion(
    @Param('ID') ID: string,
    @Headers('uid') user_id: string,
  ): Promise<ResponsePayload<undefined>> {
    try {
      await this.service.DeleteQuestion(ID);
      await this.audit.CreateAuditReport({
        entity_ID: ID,
        entity_table_name: tableName,
        operation_type: 'D',
        user_ID: user_id,
      });
      return {
        status_code: HttpStatus.OK,
        message: `Pregunta ${ID} eliminada`,
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

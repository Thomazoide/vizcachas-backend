import { BadRequestException, Body, Controller, Delete, Get, Headers, HttpStatus, Param, Post, Put } from "@nestjs/common";
import { TriviaCompletionService } from "./trivia-completion.service.js";
import { ResponsePayload } from "../payloads/response.payloads.js";
import { TriviaCompletion } from "../models/trivia-completion.model.js";
import { AuditService } from "../audit/audit.service.js";

@Controller("trivia-completions")
export class TriviaCompletionController {
    constructor(
        private readonly service: TriviaCompletionService,
        private readonly audit: AuditService
    ) {};

    @Get()
    async GetAllTriviaCompletions(): Promise<ResponsePayload<TriviaCompletion[]>> {
        try {
            return {
                status_code: HttpStatus.OK,
                message: "trivia-completions",
                data: await this.service.GetAllTriviaCompletions(),
                error: false
            };
        } catch (e) {
            return {
                status_code: HttpStatus.BAD_REQUEST,
                message: e instanceof Error ? e.message : "Error desconocido",
                error: true
            };
        }
    }

    @Post()
    async CreateTriviaCompletion(
        @Body() data: Partial<TriviaCompletion>,
        @Headers("uid") user_id: string
    ): Promise<ResponsePayload<TriviaCompletion>> {
        try {
            const entity = await this.service.CreateTriviaCompletion(data);
            await this.audit.CreateAuditReport({
                entity_ID: entity.ID,
                entity_table_name: "trivia_completion",
                operation_date: new Date(),
                operation_type: "C",
                user_ID: user_id
            });
            return {
                status_code: HttpStatus.CREATED,
                message: "TriviaCompletion creado",
                data: entity,
                error: false
            };
        } catch (e) {
            return {
                status_code: HttpStatus.BAD_REQUEST,
                message: e instanceof Error ? e.message : "Error desconocido",
                error: true
            };
        }
    }

    @Put()
    async UpdateTriviaCompletion(
        @Body() data: Partial<TriviaCompletion>,
        @Headers("uid") user_id: string
    ): Promise<ResponsePayload<TriviaCompletion>> {
        try {
            const entity = await this.service.UpdateTriviaCompletion(data);
            await this.audit.CreateAuditReport({
                entity_ID: entity.ID,
                entity_table_name: "trivia_completion",
                operation_date: new Date(),
                operation_type: "U",
                user_ID: user_id
            });
            return {
                status_code: HttpStatus.OK,
                message: "TriviaCompletion actualizado",
                data: entity,
                error: false
            };
        } catch (e) {
            return {
                status_code: HttpStatus.BAD_REQUEST,
                message: e instanceof Error ? e.message : "Error desconocido",
                error: true
            };
        }
    }

    @Get(":ID")
    async GetTriviaCompletionByID(
        @Param("ID") ID: string,
        @Headers("uid") user_id: string
    ): Promise<ResponsePayload<TriviaCompletion>> {
        try {
            const entity = await this.service.FindByID(ID);
            await this.audit.CreateAuditReport({
                entity_ID: entity.ID,
                entity_table_name: "trivia_completion",
                operation_date: new Date(),
                operation_type: "R",
                user_ID: user_id
            });
            return {
                status_code: HttpStatus.OK,
                message: "TriviaCompletion encontrado",
                data: entity,
                error: false
            };
        } catch (e) {
            return {
                status_code: e instanceof BadRequestException ? HttpStatus.BAD_REQUEST : e instanceof Error ? HttpStatus.NOT_FOUND : HttpStatus.BAD_REQUEST,
                message: e instanceof Error ? e.message : "Error desconocido",
                error: true
            };
        }
    }

    @Delete(":ID")
    async DeleteTriviaCompletion(
        @Param("ID") ID: string,
        @Headers("uid") user_id: string
    ): Promise<ResponsePayload<undefined>> {
        try {
            await this.service.DeleteTriviaCompletion(ID);
            await this.audit.CreateAuditReport({
                entity_ID: ID,
                entity_table_name: "trivia_completion",
                operation_date: new Date(),
                operation_type: "D",
                user_ID: user_id
            });
            return {
                status_code: HttpStatus.OK,
                message: "TriviaCompletion eliminado",
                error: false
            };
        } catch (e) {
            return {
                status_code: e instanceof BadRequestException ? HttpStatus.BAD_REQUEST : e instanceof Error ? HttpStatus.NOT_FOUND : HttpStatus.BAD_REQUEST,
                message: e instanceof Error ? e.message : "Error desconocido",
                error: true
            };
        }
    }
}

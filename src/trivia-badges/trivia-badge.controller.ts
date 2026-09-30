import { BadRequestException, Body, Controller, Delete, Get, Headers, HttpStatus, Param, Post, Put } from "@nestjs/common";
import { TriviaBadgeService } from "./trivia-badge.service.js";
import { ResponsePayload } from "../payloads/response.payloads.js";
import { TriviaBadge } from "../models/trivia-badge.model.js";
import { AuditService } from "../audit/audit.service.js";

@Controller("trivia-badges")
export class TriviaBadgeController {
    constructor(
        private readonly service: TriviaBadgeService,
        private readonly audit: AuditService
    ) {};

    @Get()
    async GetAllTriviaBadges(): Promise<ResponsePayload<TriviaBadge[]>> {
        try {
            return {
                status_code: HttpStatus.OK,
                message: "trivia-badges",
                data: await this.service.GetAllTriviaBadges(),
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
    async CreateTriviaBadge(
        @Body() data: Partial<TriviaBadge>,
        @Headers("uid") user_id: string
    ): Promise<ResponsePayload<TriviaBadge>> {
        try {
            const entity = await this.service.CreateTriviaBadge(data);
            await this.audit.CreateAuditReport({
                entity_ID: entity.ID,
                entity_table_name: "trivia_badge",
                operation_date: new Date(),
                operation_type: "C",
                user_ID: user_id
            });
            return {
                status_code: HttpStatus.CREATED,
                message: "TriviaBadge creado",
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
    async UpdateTriviaBadge(
        @Body() data: Partial<TriviaBadge>,
        @Headers("uid") user_id: string
    ): Promise<ResponsePayload<TriviaBadge>> {
        try {
            const entity = await this.service.UpdateTriviaBadge(data);
            await this.audit.CreateAuditReport({
                entity_ID: entity.ID,
                entity_table_name: "trivia_badge",
                operation_date: new Date(),
                operation_type: "U",
                user_ID: user_id
            });
            return {
                status_code: HttpStatus.OK,
                message: "TriviaBadge actualizado",
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
    async GetTriviaBadgeByID(
        @Param("ID") ID: string,
        @Headers("uid") user_id: string
    ): Promise<ResponsePayload<TriviaBadge>> {
        try {
            const entity = await this.service.FindByID(ID);
            await this.audit.CreateAuditReport({
                entity_ID: entity.ID,
                entity_table_name: "trivia_badge",
                operation_date: new Date(),
                operation_type: "R",
                user_ID: user_id
            });
            return {
                status_code: HttpStatus.OK,
                message: "TriviaBadge encontrado",
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
    async DeleteTriviaBadge(
        @Param("ID") ID: string,
        @Headers("uid") user_id: string
    ): Promise<ResponsePayload<undefined>> {
        try {
            await this.service.DeleteTriviaBadge(ID);
            await this.audit.CreateAuditReport({
                entity_ID: ID,
                entity_table_name: "trivia_badge",
                operation_date: new Date(),
                operation_type: "D",
                user_ID: user_id
            });
            return {
                status_code: HttpStatus.OK,
                message: "TriviaBadge eliminado",
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

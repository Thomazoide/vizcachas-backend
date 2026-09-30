import { BadRequestException, Body, Controller, Delete, Get, Headers, HttpStatus, Param, Post, Put } from "@nestjs/common";
import { BadgeService } from "./badge.service.js";
import { ResponsePayload } from "../payloads/response.payloads.js";
import { Badge } from "../models/badge.model.js";
import { AuditService } from "../audit/audit.service.js";

@Controller("badges")
export class BadgeController {
    constructor(
        private readonly service: BadgeService,
        private readonly audit: AuditService
    ) {};

    @Get()
    async GetAllBadges(): Promise<ResponsePayload<Badge[]>> {
        try {
            return {
                status_code: HttpStatus.OK,
                message: "badges",
                data: await this.service.GetAllBadges(),
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
    async CreateBadge(
        @Body() data: Partial<Badge>,
        @Headers("uid") user_id: string
    ): Promise<ResponsePayload<Badge>> {
        try {
            const entity = await this.service.CreateBadge(data);
            await this.audit.CreateAuditReport({
                entity_ID: entity.ID,
                entity_table_name: "badge",
                operation_date: new Date(),
                operation_type: "C",
                user_ID: user_id
            });
            return {
                status_code: HttpStatus.CREATED,
                message: "Badge creado",
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
    async UpdateBadge(
        @Body() data: Partial<Badge>,
        @Headers("uid") user_id: string
    ): Promise<ResponsePayload<Badge>> {
        try {
            const entity = await this.service.UpdateBadge(data);
            await this.audit.CreateAuditReport({
                entity_ID: entity.ID,
                entity_table_name: "badge",
                operation_date: new Date(),
                operation_type: "U",
                user_ID: user_id
            });
            return {
                status_code: HttpStatus.OK,
                message: "Badge actualizado",
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
    async GetBadgeByID(
        @Param("ID") ID: string,
        @Headers("uid") user_id: string
    ): Promise<ResponsePayload<Badge>> {
        try {
            const entity = await this.service.FindByID(ID);
            await this.audit.CreateAuditReport({
                entity_ID: entity.ID,
                entity_table_name: "badge",
                operation_date: new Date(),
                operation_type: "R",
                user_ID: user_id
            });
            return {
                status_code: HttpStatus.OK,
                message: "Badge encontrado",
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
    async DeleteBadge(
        @Param("ID") ID: string,
        @Headers("uid") user_id: string
    ): Promise<ResponsePayload<undefined>> {
        try {
            await this.service.DeleteBadge(ID);
            await this.audit.CreateAuditReport({
                entity_ID: ID,
                entity_table_name: "badge",
                operation_date: new Date(),
                operation_type: "D",
                user_ID: user_id
            });
            return {
                status_code: HttpStatus.OK,
                message: "Badge eliminado",
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

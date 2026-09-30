import { BadRequestException, Body, Controller, Delete, Get, Headers, HttpStatus, Param, Post, Put } from "@nestjs/common";
import { UserBadgeService } from "./user-badge.service.js";
import { ResponsePayload } from "../payloads/response.payloads.js";
import { UserBadge } from "../models/user-badge.model.js";
import { AuditService } from "../audit/audit.service.js";

@Controller("user-badges")
export class UserBadgeController {
    constructor(
        private readonly service: UserBadgeService,
        private readonly audit: AuditService
    ) {};

    @Get()
    async GetAllUserBadges(): Promise<ResponsePayload<UserBadge[]>> {
        try {
            return {
                status_code: HttpStatus.OK,
                message: "user-badges",
                data: await this.service.GetAllUserBadges(),
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
    async CreateUserBadge(
        @Body() data: Partial<UserBadge>,
        @Headers("uid") user_id: string
    ): Promise<ResponsePayload<UserBadge>> {
        try {
            const entity = await this.service.CreateUserBadge(data);
            await this.audit.CreateAuditReport({
                entity_ID: entity.ID,
                entity_table_name: "user_badge",
                operation_date: new Date(),
                operation_type: "C",
                user_ID: user_id
            });
            return {
                status_code: HttpStatus.CREATED,
                message: "UserBadge creado",
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
    async UpdateUserBadge(
        @Body() data: Partial<UserBadge>,
        @Headers("uid") user_id: string
    ): Promise<ResponsePayload<UserBadge>> {
        try {
            const entity = await this.service.UpdateUserBadge(data);
            await this.audit.CreateAuditReport({
                entity_ID: entity.ID,
                entity_table_name: "user_badge",
                operation_date: new Date(),
                operation_type: "U",
                user_ID: user_id
            });
            return {
                status_code: HttpStatus.OK,
                message: "UserBadge actualizado",
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
    async GetUserBadgeByID(
        @Param("ID") ID: string,
        @Headers("uid") user_id: string
    ): Promise<ResponsePayload<UserBadge>> {
        try {
            const entity = await this.service.FindByID(ID);
            await this.audit.CreateAuditReport({
                entity_ID: entity.ID,
                entity_table_name: "user_badge",
                operation_date: new Date(),
                operation_type: "R",
                user_ID: user_id
            });
            return {
                status_code: HttpStatus.OK,
                message: "UserBadge encontrado",
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
    async DeleteUserBadge(
        @Param("ID") ID: string,
        @Headers("uid") user_id: string
    ): Promise<ResponsePayload<undefined>> {
        try {
            await this.service.DeleteUserBadge(ID);
            await this.audit.CreateAuditReport({
                entity_ID: ID,
                entity_table_name: "user_badge",
                operation_date: new Date(),
                operation_type: "D",
                user_ID: user_id
            });
            return {
                status_code: HttpStatus.OK,
                message: "UserBadge eliminado",
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

import { Body, Controller, Delete, Get, Headers, HttpStatus, Param, Post, Put } from "@nestjs/common";
import { UserService } from "./user.service.js";
import { AuditService } from "../audit/audit.service.js";
import { ResponsePayload } from "../payloads/response.payloads.js";
import { User } from "../models/user.model.js";
import { CheckError } from "../utils/error-verifier.util.js";

@Controller("users")
export class UserController {
    constructor(
        private readonly service: UserService,
        private readonly audit: AuditService
    ){};

    @Get()
    async GetAllUsers(): Promise<ResponsePayload<User[]>> {
        try {
            return {
                status_code: HttpStatus.OK,
                message: "Usuarios encontrados",
                data: await this.service.GetAllUsers(),
                error: false
            };
        } catch (e) {
            return {
                status_code: HttpStatus.BAD_REQUEST,
                message: CheckError(e),
                error: true
            };
        }
    }

    @Post()
    async Register(
        @Body()
        userData: Partial<User>
    ): Promise<ResponsePayload<User>> {
        try {
            const newUser = await this.service.CreateUser(userData);
            const audit = await this.audit.CreateAuditReport({
                entity_ID: newUser.ID,
                entity_table_name: "user",
                operation_date: new Date(),
                operation_type: "C"
            });
            this.audit.LogNewAudit(audit);
            return {
                status_code: HttpStatus.CREATED,
                message: `Usuario creado (${newUser.ID})`,
                data: newUser,
                error: false
            };
        } catch (e) {
            return {
                status_code: HttpStatus.BAD_REQUEST,
                message: CheckError(e),
                error: true
            };
        }
    }

    @Get("email/:mail")
    async FindByEmail(
        @Param("mail")
        email: string,
        @Headers("uid")
        user_id: string
    ): Promise<ResponsePayload<User>> {
        try {
            const user = await this.service.FindByEmail(email);
            const audit = await this.audit.CreateAuditReport({
                entity_ID: user.ID,
                entity_table_name: "user",
                operation_date: new Date(),
                operation_type: "R",
                user_ID: user_id
            });
            this.audit.LogNewAudit(audit);
            return {
                status_code: HttpStatus.OK,
                message: `Usuario ${email} encontrado`,
                data: user,
                error: false
            };
        } catch (e) {
            return {
                status_code: HttpStatus.BAD_REQUEST,
                message: CheckError(e),
                error: true
            };
        }
    }

    @Get(":ID")
    async FindByID(
        @Param("ID")
        userID: string,
        @Headers("uid")
        user_id: string
    ): Promise<ResponsePayload<User>> {
        try {
            const user = await this.service.FindByID(userID);
            await this.audit.CreateAuditReport({
                entity_ID: user.ID,
                entity_table_name: "user",
                operation_date: new Date(),
                operation_type: "R",
                user_ID: user_id
            });
            return {
                status_code: HttpStatus.OK,
                message: `Usuario ${userID} encontrado`,
                data: user,
                error: false
            };
        } catch (e) {
            return {
                status_code: HttpStatus.BAD_REQUEST,
                message: CheckError(e),
                error: true
            };
        }
    }

    @Put()
    async UpdateUserData(
        @Body()
        data: Partial<User>,
        @Headers("uid")
        user_id: string
    ): Promise<ResponsePayload<User>> {
        try {
            const updatedUser = await this.service.UpdateUser(data);
            const audit = await this.audit.CreateAuditReport({
                entity_ID: updatedUser.ID,
                entity_table_name: "user",
                operation_date: new Date(),
                operation_type: "U",
                user_ID: user_id
            });
            this.audit.LogNewAudit(audit);
            return {
                status_code: HttpStatus.OK,
                message: "Usuario actualizado",
                data: updatedUser,
                error: false
            };
        } catch (e) {
            return {
                status_code: HttpStatus.BAD_REQUEST,
                message: CheckError(e),
                error: true
            };
        }
    }

    @Delete(":ID")
    async DeleteUser(
        @Param("ID")
        userID: string,
        @Headers("uid")
        user_id: string
    ): Promise<ResponsePayload<undefined>> {
        try {
            await this.service.DeleteUser(userID);
            const audit = await this.audit.CreateAuditReport({
                entity_ID: userID,
                entity_table_name: "user",
                operation_date: new Date(),
                operation_type: "D",
                user_ID: user_id
            });
            this.audit.LogNewAudit(audit);
            return {
                status_code: HttpStatus.OK,
                message: `Usuario ${userID} eliminado`,
                error: false
            };
        } catch (e) {
            return {
                status_code: HttpStatus.BAD_REQUEST,
                message: CheckError(e),
                error: true
            };
        }
    }
};
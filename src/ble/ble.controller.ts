import { Body, Controller, Delete, Get, Headers, HttpStatus, Param, Post, Put } from "@nestjs/common";
import { BleService } from "./ble.service.js";
import { ResponsePayload } from "../payloads/response.payloads.js";
import { Ble } from "../models/ble.model.js";
import { EntityNotFoundError } from "typeorm";
import { AuditService } from "../audit/audit.service.js";

@Controller("ble")
export class BleController {
    constructor(
        private readonly service: BleService,
        private readonly audit: AuditService
    ){};

    @Get()
    async GetAllDevices(): Promise<ResponsePayload<Ble[]>> {
        try {
            return {
                status_code: HttpStatus.OK,
                message: "dispositivos existentes",
                data: await this.service.GetAll(),
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
    async CreateBLE(
        @Body()
        data: Partial<Ble>,
        @Headers("uid")
        user_id: string
    ): Promise<ResponsePayload<Ble>> {
        try {
            const newBle = await this.service.Create(data);
            const audit = await this.audit.CreateAuditReport({
                entity_ID: newBle.ID,
                entity_table_name: "ble",
                operation_type: "C",
                operation_date: new Date(),
                user_ID: user_id
            })
            this.audit.LogNewAudit(audit);
            return {
                status_code: HttpStatus.CREATED,
                message: "BLE creado",
                data: newBle,
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
    async UpdateBLE(
        @Body()
        data: Partial<Ble>,
        @Headers("uid")
        user_id: string
    ): Promise<ResponsePayload<Ble>> {
        try {
            const updatedBle = await this.service.Update(data);
            const audit = await this.audit.CreateAuditReport({
                entity_ID: updatedBle.ID,
                entity_table_name: "ble",
                operation_type: "U",
                operation_date: new Date(),
                user_ID: user_id
            });
            this.audit.LogNewAudit(audit);
            return {
                status_code: HttpStatus.OK,
                message: `Ble ${data.mac} actualizado`,
                data: updatedBle,
                error: false
            };
        } catch (e) {
            const isNotFound = e instanceof EntityNotFoundError;
            return {
                status_code: isNotFound ? HttpStatus.NOT_FOUND : HttpStatus.BAD_REQUEST,
                message: isNotFound || e instanceof Error ? e.message : "Error desconocido",
                error: true
            };
        }
    }

    @Get("mac/:MAC")
    async GetByMAC(
        @Param("MAC")
        bleMAC: string,
        @Headers("uid")
        user_id: string
    ): Promise<ResponsePayload<Ble>> {
        try {
            const ble = await this.service.FindByMAC(bleMAC);
            const audit = await this.audit.CreateAuditReport({
                entity_ID: ble.ID,
                entity_table_name: "ble",
                operation_type: "R",
                operation_date: new Date(),
                user_ID: user_id
            });
            this.audit.LogNewAudit(audit);
            return {
                status_code: HttpStatus.OK,
                message: `Dispositivo ${bleMAC} encontrado`,
                data: ble,
                error: false
            };
        } catch (e) {
            const isNotFound = e instanceof EntityNotFoundError;
            return {
                status_code: isNotFound ? HttpStatus.NOT_FOUND : HttpStatus.BAD_REQUEST,
                message: e instanceof Error ? e.message : "Error desconocido",
                error: true
            };
        }
    }

    @Get(":ID")
    async GetByID(
        @Param("ID")
        bleID: string,
        @Headers("uid")
        user_id: string
    ): Promise<ResponsePayload<Ble>> {
        try {
            const ble = await this.service.FindByID(bleID);
            const audit = await this.audit.CreateAuditReport({
                entity_ID: ble.ID,
                entity_table_name: "ble",
                operation_type: "R",
                operation_date: new Date(),
                user_ID: user_id
            });
            this.audit.LogNewAudit(audit);
            return {
                status_code: HttpStatus.OK,
                message: "BLE encontrado",
                data: ble,
                error: false
            };
        } catch (e) {
            return {
                status_code: e instanceof EntityNotFoundError ? HttpStatus.NOT_FOUND : HttpStatus.BAD_REQUEST,
                message: e instanceof Error || e instanceof EntityNotFoundError ? e.message : "Error desconocido",
                error: true
            };
        }
    }

    @Delete(":ID")
    async DeleteByID(
        @Param("ID")
        bleID: string,
        @Headers("uid")
        user_id: string
    ): Promise<ResponsePayload<Ble>> {
        try {
            await this.service.Delete(bleID);
            const audit = await this.audit.CreateAuditReport({
                entity_ID: bleID,
                entity_table_name: "ble",
                operation_type: "D",
                operation_date: new Date(),
                user_ID: user_id
            });
            this.audit.LogNewAudit(audit);
            return {
                status_code: HttpStatus.OK,
                message: `Dispositivo ${bleID} eliminado`,
                error: false
            };
        } catch (e) {
            const isNotFound = e instanceof EntityNotFoundError;
            return {
                status_code: isNotFound ? HttpStatus.NOT_FOUND : HttpStatus.BAD_REQUEST,
                message: e instanceof Error ? e.message : "Error desconocido",
                error: true
            };
        }
    }
};
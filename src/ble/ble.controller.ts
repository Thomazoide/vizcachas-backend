import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put } from "@nestjs/common";
import { BleService } from "./ble.service.js";
import { ResponsePayload } from "../payloads/response.payloads.js";
import { Ble } from "../models/ble.model.js";
import { EntityNotFoundError } from "typeorm";

@Controller("ble")
export class BleController {
    constructor(
        private readonly service: BleService
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
        data: Partial<Ble>
    ): Promise<ResponsePayload<Ble>> {
        try {
            return {
                status_code: HttpStatus.CREATED,
                message: "BLE creado",
                data: await this.service.Create(data),
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
        data: Partial<Ble>
    ): Promise<ResponsePayload<Ble>> {
        try {
            return {
                status_code: HttpStatus.OK,
                message: `Ble ${data.mac} actualizado`,
                data: await this.service.Update(data),
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
        bleMAC: string
    ): Promise<ResponsePayload<Ble>> {
        try {
            return {
                status_code: HttpStatus.OK,
                message: `Dispositivo ${bleMAC} encontrado`,
                data: await this.service.FindByMAC(bleMAC),
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
        bleID: string
    ): Promise<ResponsePayload<Ble>> {
        try {
            return {
                status_code: HttpStatus.OK,
                message: "BLE encontrado",
                data: await this.service.FindByID(bleID),
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
        bleID: string
    ): Promise<ResponsePayload<Ble>> {
        try {
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
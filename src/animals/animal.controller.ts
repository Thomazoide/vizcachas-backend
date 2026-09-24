import { Body, Controller, Delete, Get, Header, Headers, HttpStatus, Param, Post, Put } from "@nestjs/common";
import { AnimalService } from "./animal.service.js";
import { ResponsePayload } from "../payloads/response.payloads.js";
import { Animal } from "../models/animal.model.js";
import { AuditService } from "../audit/audit.service.js";

@Controller("animals")
export class AnimalController {
    constructor(
        private readonly service: AnimalService,
        private readonly audit: AuditService
    ){};

    @Get()
    async GetAllAnimals(): Promise<ResponsePayload<Animal[]>> {
        try {
            return {
                status_code: HttpStatus.OK,
                message: "animales",
                data: await this.service.GetAllAnimals(),
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
    async CreateAnimal(
        @Body()
        data: Partial<Animal>,
        @Headers("uid")
        user_id: string
    ): Promise<ResponsePayload<Animal>> {
        try {
            const newAnimal = await this.service.CreateAnimal(data);
            this.audit.CreateAuditReport({
                entity_ID: newAnimal.ID,
                entity_table_name: "animal",
                operation_date: new Date(),
                operation_type: "C",
                user_ID: user_id
            })
            return {
                status_code: HttpStatus.CREATED,
                message: "animal creado",
                data: newAnimal,
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
    async UpdateAnimal(
        @Body()
        data: Partial<Animal>,
        @Headers("uid")
        user_id: string
    ): Promise<ResponsePayload<Animal>> {
        try {
            const updatedAnimal = await this.service.UpdateAnimal(data);
            this.audit.CreateAuditReport({
                entity_ID: updatedAnimal.ID,
                entity_table_name: "animal",
                operation_date: new Date(),
                operation_type: "U",
                user_ID: user_id
            })
            return {
                status_code: HttpStatus.OK,
                message: "Animal actualizado",
                data: updatedAnimal,
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
    async GetAnimalByID(
        @Param("ID")
        animalID: string,
        @Headers("uid")
        user_id: string
    ): Promise<ResponsePayload<Animal>> {
        try {
            const animal = await this.service.FindByID(animalID);
            this.audit.CreateAuditReport({
                entity_ID: animal.ID,
                entity_table_name: "animal",
                operation_date: new Date(),
                operation_type: "R",
                user_ID: user_id
            })
            return {
                status_code: HttpStatus.OK,
                message: "animal encontrado",
                data: animal,
                error: false
            };
        } catch (e) {
            return {
                status_code: e instanceof Error ? HttpStatus.NOT_FOUND : HttpStatus.BAD_REQUEST,
                message: e instanceof Error ? e.message : "Error desconocido",
                error: true
            };
        }
    }

    @Delete(":ID")
    async DeleteAnimal(
        @Param("ID")
        animalID: string,
        @Headers("uid")
        user_id: string
    ): Promise<ResponsePayload<undefined>> {
        try {
            await this.service.DeleteAnimal(animalID)
            await this.audit.CreateAuditReport({
                entity_ID: animalID,
                entity_table_name: "animal",
                operation_date: new Date(),
                operation_type: "D",
                user_ID: user_id
            })
            return {
                status_code: HttpStatus.OK,
                message: `Animal ${animalID} eliminado`,
                error: false
            };
        } catch (e) {
            return {
                status_code: e instanceof Error ? HttpStatus.NOT_FOUND : HttpStatus.BAD_REQUEST,
                message: e instanceof Error ? e.message : "Error desconocido",
                error: true
            };
        }
    }
};
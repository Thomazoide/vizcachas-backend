import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put } from "@nestjs/common";
import { AnimalService } from "./animal.service.js";
import { ResponsePayload } from "../payloads/response.payloads.js";
import { Animal } from "../models/animal.model.js";

@Controller("animals")
export class AnimalController {
    constructor(
        private readonly service: AnimalService
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
        data: Partial<Animal>
    ): Promise<ResponsePayload<Animal>> {
        try {
            return {
                status_code: HttpStatus.CREATED,
                message: "animal creado",
                data: await this.service.CreateAnimal(data),
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
        data: Partial<Animal>
    ): Promise<ResponsePayload<Animal>> {
        try {
            return {
                status_code: HttpStatus.OK,
                message: "Animal actualizado",
                data: await this.service.UpdateAnimal(data),
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
        animalID: string
    ): Promise<ResponsePayload<Animal>> {
        try {
            return {
                status_code: HttpStatus.OK,
                message: "animal encontrado",
                data: await this.service.FindByID(animalID),
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
        animalID: string
    ): Promise<ResponsePayload<undefined>> {
        try {
            await this.service.DeleteAnimal(animalID)
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
import { Module } from "@nestjs/common";
import { AnimalController } from "./animal.controller.js";
import { AnimalService } from "./animal.service.js";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Animal } from "../models/animal.model.js";
import { Audit } from "../models/audit.model.js";

@Module({
    imports: [TypeOrmModule.forFeature([Animal, Audit])],
    providers: [AnimalService],
    controllers: [AnimalController]
})
export class AnimalModule {};
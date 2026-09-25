import { Module } from "@nestjs/common";
import { AnimalController } from "./animal.controller.js";
import { AnimalService } from "./animal.service.js";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Animal } from "../models/animal.model.js";
import { Audit } from "../models/audit.model.js";
import { AuditService } from "../audit/audit.service.js";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Animal,
            Audit
        ])
    ],
    providers: [
        AnimalService,
        AuditService
    ],
    controllers: [
        AnimalController
    ]
})
export class AnimalModule {};
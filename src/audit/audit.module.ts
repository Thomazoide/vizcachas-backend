import { Module } from "@nestjs/common";
import { AuditService } from "./audit.service.js";
import { AuditController } from "./audit.controller.js";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Audit } from "../models/audit.model.js";

@Module({
    imports: [
        TypeOrmModule.forFeature([Audit])
    ],
    controllers: [AuditController],
    providers: [AuditService]
})
export class AuditModule {};
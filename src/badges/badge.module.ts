import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BadgeController } from "./badge.controller.js";
import { BadgeService } from "./badge.service.js";
import { Badge } from "../models/badge.model.js";
import { Audit } from "../models/audit.model.js";
import { AuditService } from "../audit/audit.service.js";

@Module({
    imports: [TypeOrmModule.forFeature([Badge, Audit])],
    providers: [BadgeService, AuditService],
    controllers: [BadgeController]
})
export class BadgeModule {};

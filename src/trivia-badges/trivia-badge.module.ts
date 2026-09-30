import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TriviaBadgeController } from "./trivia-badge.controller.js";
import { TriviaBadgeService } from "./trivia-badge.service.js";
import { TriviaBadge } from "../models/trivia-badge.model.js";
import { Audit } from "../models/audit.model.js";
import { AuditService } from "../audit/audit.service.js";

@Module({
    imports: [TypeOrmModule.forFeature([TriviaBadge, Audit])],
    providers: [TriviaBadgeService, AuditService],
    controllers: [TriviaBadgeController]
})
export class TriviaBadgeModule {};

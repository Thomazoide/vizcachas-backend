import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserBadgeController } from "./user-badge.controller.js";
import { UserBadgeService } from "./user-badge.service.js";
import { UserBadge } from "../models/user-badge.model.js";
import { Audit } from "../models/audit.model.js";
import { AuditService } from "../audit/audit.service.js";

@Module({
    imports: [TypeOrmModule.forFeature([UserBadge, Audit])],
    providers: [UserBadgeService, AuditService],
    controllers: [UserBadgeController]
})
export class UserBadgeModule {};

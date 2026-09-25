import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../models/user.model.js";
import { Audit } from "../models/audit.model.js";
import { UserController } from "./user.controller.js";
import { UserService } from "./user.service.js";
import { AuditService } from "../audit/audit.service.js";

@Module({
    imports: [
        TypeOrmModule.forFeature([User, Audit])
    ],
    controllers: [
        UserController
    ],
    providers: [
        UserService,
        AuditService
    ]
})
export class UserModule {};
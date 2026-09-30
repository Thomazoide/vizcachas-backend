import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TriviaCompletionController } from "./trivia-completion.controller.js";
import { TriviaCompletionService } from "./trivia-completion.service.js";
import { TriviaCompletion } from "../models/trivia-completion.model.js";
import { Audit } from "../models/audit.model.js";
import { AuditService } from "../audit/audit.service.js";

@Module({
    imports: [TypeOrmModule.forFeature([TriviaCompletion, Audit])],
    providers: [TriviaCompletionService, AuditService],
    controllers: [TriviaCompletionController]
})
export class TriviaCompletionModule {};

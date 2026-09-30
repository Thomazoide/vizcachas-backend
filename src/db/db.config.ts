import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { Animal } from "../models/animal.model.js";
import { Ble } from "../models/ble.model.js";
import { Audit } from "../models/audit.model.js";
import { User } from "../models/user.model.js";
import { Alternative } from "../models/alternative.model.js";
import { Badge } from "../models/badge.model.js";
import { Question } from "../models/question.model.js";
import { Trivia } from "../models/trivia.model.js";
import { TriviaBadge } from "../models/trivia-badge.model.js";
import { TriviaCompletion } from "../models/trivia-completion.model.js";
import { UserBadge } from "../models/user-badge.model.js";

export const DBCONFIG = (env: ConfigService): TypeOrmModuleOptions => {
    return {
        type: "postgres",
        port: Number(env.get<string>("DBPORT")),
        host: env.get<string>("DBHOST"),
        database: env.get<string>("POSTGRES_DB"),
        username: env.get<string>("POSTGRES_USER"),
        password: env.get<string>("POSTGRES_PASSWORD"),
        entities: [Animal, Ble, Audit, User, Alternative, Badge, Question, Trivia, TriviaBadge, TriviaCompletion, UserBadge],
        synchronize: true,
    }
}
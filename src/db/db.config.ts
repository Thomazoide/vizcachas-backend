import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { Animal } from "../models/animal.model.js";
import { Ble } from "../models/ble.model.js";
import { Audit } from "../models/audit.model.js";

export const DBCONFIG = (env: ConfigService): TypeOrmModuleOptions => {
    return {
        type: "postgres",
        port: Number(env.get<string>("DBPORT")),
        host: env.get<string>("DBHOST"),
        database: env.get<string>("POSTGRES_DB"),
        username: env.get<string>("POSTGRES_USER"),
        password: env.get<string>("POSTGRES_PASSWORD"),
        entities: [Animal, Ble, Audit],
        synchronize: true,
    }
}
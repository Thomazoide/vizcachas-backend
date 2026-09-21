import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export const DBCONFIG = (env: ConfigService): TypeOrmModuleOptions => {
    return {
        type: "postgres",
        port: Number(env.get<string>("DBPORT")),
        host: env.get<string>("DBHOST"),
        database: env.get<string>("DBNAME"),
        username: env.get<string>("DBUSER"),
        password: env.get<string>("DBPASS"),
        entities: [],
        synchronize: true,
    }
}
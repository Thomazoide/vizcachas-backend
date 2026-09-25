import { Module } from "@nestjs/common";
import { BleService } from "./ble.service.js";
import { BleController } from "./ble.controller.js";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Ble } from "../models/ble.model.js";
import { Audit } from "../models/audit.model.js";

@Module({
    imports: [TypeOrmModule.forFeature([Ble, Audit])],
    controllers: [BleController],
    providers: [BleService]
})
export class BleModule {};
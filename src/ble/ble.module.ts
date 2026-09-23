import { Module } from "@nestjs/common";
import { BleService } from "./ble.service.js";
import { BleController } from "./ble.controller.js";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Ble } from "../models/ble.model.js";

@Module({
    imports: [TypeOrmModule.forFeature([Ble])],
    controllers: [BleController],
    providers: [BleService]
})
export class BleModule {};
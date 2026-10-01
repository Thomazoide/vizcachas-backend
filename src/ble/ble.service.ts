import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Ble } from "../models/ble.model.js";
import { EntityNotFoundError, IsNull, Repository } from "typeorm";

@Injectable()
export class BleService {
    constructor(
        @InjectRepository(Ble)
        private readonly repo: Repository<Ble>
    ){};

    async GetAll(): Promise<Ble[]> {
        return await this.repo.find({
            where: {
                deleted_at: IsNull()
            }
        });
    }

  async Create(data: Partial<Ble>): Promise<Ble> {
    const newBLE = data;
    newBLE.mac = data.mac?.toUpperCase()
    return await this.repo.save(newBLE);
  }

    async Update(data: Partial<Ble>): Promise<Ble> {
        const bleExists = await this.repo.findOne({
            where: {
                ID: data.ID
            }
        });
        if (!bleExists) throw new EntityNotFoundError(Ble, "");
        return await this.repo.save(data);
    }

    async Delete(bleID: string): Promise<void> {
        const bleExists = await this.repo.findOne({
            where: {
                ID: bleID
            }
        });
        if (!bleExists) throw new EntityNotFoundError(Ble, "");
        await this.repo.softDelete(bleExists.ID);
        return;
    }

    async FindByID(bleID: string): Promise<Ble> {
        const bleExists = await this.repo.findOne({
            where: {
                ID: bleID
            }
        });
        if (!bleExists) throw new EntityNotFoundError(Ble, "");
        return bleExists;
    }

    async FindByMAC(mac: string): Promise<Ble> {
        const bleExists = await this.repo.findOne({
            where: {
                mac
            }
        });
        if (!bleExists) throw new EntityNotFoundError(Ble, "");
        return bleExists;
    }
};

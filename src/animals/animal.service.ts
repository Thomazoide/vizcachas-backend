import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Animal } from "../models/animal.model.js";
import { EntityNotFoundError, IsNull, Repository } from "typeorm";

@Injectable()
export class AnimalService {
    constructor(
        @InjectRepository(Animal)
        private readonly repo: Repository<Animal>
    ){};

    async GetAllAnimals(): Promise<Animal[]> {
        return this.repo.find({
            where: {
                deleted_at: IsNull()
            }
        });
    }

    async CreateAnimal(newAnimal: Partial<Animal>): Promise<Animal> {
        const animal = this.repo.create(newAnimal);
        return this.repo.save(animal);
    }

    async UpdateAnimal(updatedAnimal: Partial<Animal>): Promise<Animal> {
        const animalExists = await this.repo.findOne({
            where: {
                ID: updatedAnimal.ID
            },
        });
        if (!animalExists) throw new EntityNotFoundError(Animal, "");
        return this.repo.save(updatedAnimal);
    }

    async DeleteAnimal(animalID: string): Promise<void> {
        const animalExists = await this.repo.findOne({
            where: {
                ID: animalID
            }
        });
        if (!animalExists) throw new EntityNotFoundError(Animal, "");
        await this.repo.softDelete(animalExists.ID);
        return;
    }

    async FindByID(animalID: string): Promise<Animal> {
        const animalExists = await this.repo.findOne({
            where: {
                ID: animalID
            }
        });
        if (!animalExists) throw new EntityNotFoundError(Animal, "");
        return animalExists;
    }

  async FindByBLE(mac: string): Promise<Animal> {
    if (typeof mac !== "string" || !mac.trim()) throw new BadRequestException("La dirección MAC es inválida");
    const normalizedMAC = mac.trim();
    const animal = await this.repo.findOne({
      relations: {
        ble: true
      },
      where: {
        ble: {
          mac: normalizedMAC,
          deleted_at: IsNull()
        },
      }
    });
    if (!animal) throw new EntityNotFoundError(Animal, {
      ble: {
        mac: normalizedMAC
      }
    });
    return animal;
  }
}

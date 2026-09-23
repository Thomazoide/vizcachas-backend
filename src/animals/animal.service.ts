import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Animal } from "../models/animal.model.js";
import { EntityNotFoundError, Repository } from "typeorm";

@Injectable()
export class AnimalService {
    constructor(
        @InjectRepository(Animal) 
        private readonly repo: Repository<Animal>
    ){};

    async GetAllAnimals(): Promise<Animal[]> {
        return this.repo.find();
    }

    async CreateAnimal(newAnimal: Partial<Animal>): Promise<Animal> {
        return this.repo.save(newAnimal);
    }

    async UpdateAnimal(updatedAnimal: Partial<Animal>): Promise<Animal> {
        const animalExists = await this.repo.findOne({
            where: {
                ID: updatedAnimal.ID
            }
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
}
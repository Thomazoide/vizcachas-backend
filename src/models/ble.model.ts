import { Column, Entity, OneToOne, PrimaryColumn } from "typeorm";
import { Animal } from "./animal.model.js";

@Entity({name: "ble"})
export class Ble {
    @PrimaryColumn({type: "uuid", generated: "uuid"})
    ID: string;
    @Column({unique: true})
    mac: string;
    @OneToOne(() => Animal, animal => animal.ble, {nullable: true})
    animal: Animal
    @Column({type: "timestamp"})
    created_at: Date;
    @Column({type: "timestamp", default: null})
    deleted_at: Date | null;
};
import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToOne, PrimaryColumn, type Relation } from "typeorm";
import { Animal } from "./animal.model.js";

@Entity({name: "ble"})
export class Ble {
    @PrimaryColumn({type: "uuid", generated: "uuid"})
    ID: string;
    @Column({type: "varchar", unique: true})
    mac: string;
    @OneToOne(() => Animal, animal => animal.ble, {nullable: true})
    animal: Relation<Animal>
    @CreateDateColumn({type: "timestamp"})
    created_at: Date;
    @DeleteDateColumn({type: "timestamp", nullable: true, default: null})
    deleted_at: Date | null;
};

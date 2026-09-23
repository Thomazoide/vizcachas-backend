import { Column, Entity, OneToOne, PrimaryColumn } from "typeorm";
import { Ble } from "./ble.model.js";

@Entity({
    name: "animal"
})
export class Animal {
    @PrimaryColumn({type: "uuid", generated: "uuid"})
    ID: string;
    @Column()
    name: string;
    @Column({default: true})
    active: boolean;
    @OneToOne( () => Ble, ble => ble.animal, {nullable: true} )
    ble: Ble;
    @Column({default: null})
    image_url: string | null;
    @Column({type: "timestamp"})
    created_at: Date;
};
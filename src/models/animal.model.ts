import { Column, Entity, OneToOne, PrimaryColumn } from "typeorm";
import { Ble } from "./ble.model.js";
import { Trivia } from "./trivia.model.js";

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
  @OneToOne(() => Trivia, trivia => trivia.animal)
  trivia: Trivia;
  @Column({default: null})
  image_url: string | null;
  @Column({type: "timestamp"})
  created_at: Date;
  @Column({type: "timestamp", default: null})
  deleted_at: Date | null;
};

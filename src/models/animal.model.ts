import { type Relation, Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryColumn } from "typeorm";
import { Ble } from "./ble.model.js";
import { Trivia } from "./trivia.model.js";

@Entity({
    name: "animal"
})
export class Animal {
  @PrimaryColumn({type: "uuid", generated: "uuid"})
  ID: string;
  @Column({type: "varchar"})
  name: string;
  @Column({type: "boolean", default: true})
  active: boolean;
  @Column({type: "uuid", default: null})
  ble_id: string | null;
  @OneToOne(() => Ble, ble => ble.animal, { nullable: true })
  @JoinColumn({ name: "ble_id" })
  ble: Relation<Ble>;
  @OneToMany(() => Trivia, trivia => trivia.animal)
  trivias: Relation<Trivia[]>;
  @Column({type: "varchar", nullable: true, default: null})
  image_url: string | null;
  @CreateDateColumn({type: "timestamp"})
  created_at: Date;
  @DeleteDateColumn({type: "timestamp", nullable: true, default: null})
  deleted_at: Date | null;
};

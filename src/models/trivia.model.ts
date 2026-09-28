import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryColumn } from "typeorm";
import { Animal } from "./animal.model.js";
import { Question } from "./question.model.js";

@Entity({ name: "trivia" })
export class Trivia {
  @PrimaryColumn({ primary: true, generated: "uuid", type: "uuid" })
  ID: string;
  @Column()
  title: string;
  @Column({ name: "animal_id" })
  animalID: string;
  @Column({ type: "timestamp" })
  crated_at: Date;
  @Column({type: "timestamp", default: null})
  deleted_at: Date | null;
  @OneToOne(() => Animal, animal => animal.trivia)
  @JoinColumn({ name: "animal_id" })
  animal: Animal;
  @OneToMany(() => Question, question => question.trivia)
  questions: Question[];
};

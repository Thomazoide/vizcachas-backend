import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn } from "typeorm";
import { Animal } from "./animal.model.js";
import { Question } from "./question.model.js";
import { TriviaBadge } from "./trivia-badge.model.js";
import { Badge } from "./badge.model.js";

@Entity({ name: "trivia" })
export class Trivia {
  @PrimaryColumn({ primary: true, generated: "uuid", type: "uuid" })
  ID: string;
  @Column()
  title: string;
  @Column({ name: "animal_id" })
  animalID: string;
  @CreateDateColumn({ type: "timestamp" })
  crated_at: Date;
  @DeleteDateColumn({type: "timestamp", default: null})
  deleted_at: Date | null;
  @ManyToOne(() => Animal, animal => animal.trivias)
  @JoinColumn({ name: "animal_id" })
  animal: Animal;
  @OneToMany(() => Question, question => question.trivia)
  questions: Question[];
  @OneToMany(() => TriviaBadge, tb => tb.trivia)
  badges: Badge[];
};

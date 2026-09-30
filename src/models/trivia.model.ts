import { type Relation, Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn } from "typeorm";
import { Animal } from "./animal.model.js";
import { Question } from "./question.model.js";
import { TriviaBadge } from "./trivia-badge.model.js";
import { Badge } from "./badge.model.js";
import { TriviaCompletion } from "./trivia-completion.model.js";

@Entity({ name: "trivia" })
export class Trivia {
  @PrimaryColumn({ primary: true, generated: "uuid", type: "uuid" })
  ID: string;
  @Column({ type: "varchar" })
  title: string;
  @Column({ name: "animal_id", type: "uuid" })
  animalID: string;
  @CreateDateColumn({ type: "timestamp" })
  crated_at: Date;
  @DeleteDateColumn({type: "timestamp", nullable: true, default: null})
  deleted_at: Date | null;
  @ManyToOne(() => Animal, animal => animal.trivias)
  @JoinColumn({ name: "animal_id" })
  animal: Relation<Animal>;
  @OneToMany(() => Question, question => question.trivia)
  questions: Relation<Question[]>;
  @OneToMany(() => TriviaBadge, tb => tb.trivia)
  badges: Relation<Badge[]>;
  @OneToMany(() => TriviaCompletion, tc => tc.trivia)
  completions: Relation<TriviaCompletion[]>;
};

import { type Relation, Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
import { Trivia } from "./trivia.model.js";
import { Alternative } from "./alternative.model.js";

@Entity({ name: "question" })
export class Question {
  @PrimaryColumn({ primary: true, generated: "uuid", type: "uuid" })
  ID: string;
  @Column({ type: "text" })
  description: string;
  @CreateDateColumn({ type: "timestamp" })
  created_at: Date;
  @DeleteDateColumn({ type: "timestamp", nullable: true, default: null })
  deleted_at: Date | null;
  @Column({ name: "trivia_id", type: "uuid" })
  triviaID: string;
  @ManyToOne(() => Trivia, trivia => trivia.questions)
  @JoinColumn({name: "trivia_id"})
  trivia: Relation<Trivia>;
  @OneToMany(() => Alternative, alternative => alternative.question)
  alternatives: Relation<Alternative[]>;
};

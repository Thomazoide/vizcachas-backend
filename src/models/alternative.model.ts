import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Question } from "./question.model.js";

@Entity("alternative")
export class Alternative {
  @PrimaryColumn({ primary: true, generated: "uuid", type: "uuid" })
  ID: string;
  @Column({ type: "text" })
  description: string;
  @Column({ name: "is_correct", type: "boolean", default: false })
  isCorrect: boolean;
  @CreateDateColumn({ type: "timestamp" })
  created_at: Date;
  @DeleteDateColumn({ type: "timestamp", default: null })
  deleted_at: Date | null;
  @Column({ name: "question_id" })
  questionID: string;
  @ManyToOne(() => Question, question => question.alternatives)
  @JoinColumn({name: "question_id"})
  question: Question;
};

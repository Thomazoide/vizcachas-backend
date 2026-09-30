import { type Relation, Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryColumn, Unique } from "typeorm";
import { User } from "./user.model.js";
import { Trivia } from "./trivia.model.js";

@Entity("trivia_completion")
@Unique(["user_id", "trivia_id"])
export class TriviaCompletion {
  @PrimaryColumn({ primary: true, generated: "uuid", type: "uuid" })
  ID: string;
  @CreateDateColumn({ type: "timestamp" })
  created_at: Date;
  @DeleteDateColumn({ type: "timestamp", nullable: true, default: null })
  deleted_at: Date | null;
  @Column({ type: "uuid" })
  user_id: string;
  @Column({ type: "uuid" })
  trivia_id: string;
  @Column({ type: "integer" })
  score: number;
  @Column({ type: "timestamp" })
  completed_at: Date;
  @ManyToOne(() => User, user => user.completed_trivias)
  user: Relation<User>;
  @ManyToOne(() => Trivia, trivia => trivia.completions)
  trivia: Relation<Trivia>;
};

import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryColumn } from "typeorm";

@Entity("trivia_completion")
export class TriviaCompletion {
  @PrimaryColumn({ primary: true, generated: "uuid", type: "uuid" })
  ID: string;
  @CreateDateColumn({ type: "timestamp" })
  created_at: Date;
  @DeleteDateColumn({ type: "timestamp", default: null })
  deleted_at: Date | null;
  @Column()
  user_id: string;
  @Column()
  trivia_id: string;
  @Column()
  score: number;
  @Column()
  completed_at: string;
};

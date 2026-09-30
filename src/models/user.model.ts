import { type Relation, Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { UserBadge } from "./user-badge.model.js";
import { TriviaCompletion } from "./trivia-completion.model.js";

export type Role = "client" | "admin";

@Entity({
    name: "user"
})
export class User {
  @PrimaryColumn({
      type: "uuid",
      generated: "uuid"
  })
  ID: string;
  @Column({type: "varchar"})
  name: string;
  @Column({type: "varchar"})
  last_name: string;
  @Column({
      type: "varchar",
      unique: true
  })
  cellphone: string;
  @Column({
      type: "varchar",
      unique: true
  })
  email: string;
  @Column({type: "varchar"})
  password: string;
  @Column({type: "varchar"})
  role: Role;
  @CreateDateColumn({type: "timestamp"})
  created_at: Date;
  @DeleteDateColumn({type: "timestamp", nullable: true, default: null})
  deleted_at: Date | null;
  @OneToMany(() => UserBadge, ub => ub.user)
  badges: Relation<UserBadge[]>;
  @OneToMany(() => TriviaCompletion, tc => tc.user)
  completed_trivias: Relation<TriviaCompletion[]>;
}

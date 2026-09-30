import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryColumn, type Relation } from "typeorm";
import { UserBadge } from "./user-badge.model.js";
import { TriviaBadge } from "./trivia-badge.model.js";

export enum REQUIREMENT_TYPE { };

@Entity("badge")
export class Badge {
  @PrimaryColumn({ primary: true, generated: "uuid", type: "uuid" })
  ID: string;
  @Column({ type: "varchar" })
  title: string;
  @CreateDateColumn({ type: "timestamp" })
  created_at: Date;
  @DeleteDateColumn({ type: "timestamp", nullable: true, default: null })
  deleted_at: Date | null;
  @Column({ type: "integer" })
  requirement_type: REQUIREMENT_TYPE;
  @Column({ type: "integer" })
  requirement_value: number;
  @OneToMany(() => UserBadge, ub => ub.badge)
  user_badge: Relation<UserBadge[]>;
  @OneToMany(() => TriviaBadge, tb => tb.badge)
  trivia: Relation<TriviaBadge[]>;
};

import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { UserBadge } from "./user-badge.model.js";

export enum REQUIREMENT_TYPE { };

@Entity("badge")
export class Badge {
  @PrimaryColumn({ primary: true, generated: "uuid", type: "uuid" })
  ID: string;
  @Column()
  title: string;
  @Column({ type: "timestamp" })
  created_at: Date;
  @Column({ type: "timestamp", default: null })
  deleted_at: Date | null;
  @Column()
  requirement_type: REQUIREMENT_TYPE;
  @Column({type: "int"})
  requirement_value: number;
  @OneToMany(() => UserBadge, ub => ub.badge)
  user_badge: UserBadge[];
};

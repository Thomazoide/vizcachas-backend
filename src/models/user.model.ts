import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { UserBadge } from "./user-badge.model.js";

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
  @Column()
  name: string;
  @Column()
  last_name: string;
  @Column({
      unique: true
  })
  cellphone: string;
  @Column({
      unique: true
  })
  email: string;
  @Column()
  password: string;
  @Column()
  role: Role;
  @CreateDateColumn({type: "timestamp"})
  created_at: Date;
  @DeleteDateColumn({type: "timestamp", default: null})
  deleted_at: Date | null;
  @OneToMany(() => UserBadge, ub => ub.user)
  badges: UserBadge[];
}

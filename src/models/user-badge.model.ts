import { type Relation, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, Unique } from "typeorm";
import { Badge } from "./badge.model.js";
import { User } from "./user.model.js";

@Entity("user_badge")
@Unique(["user_id", "badge_id"])
export class UserBadge {
  @PrimaryColumn({ primary: true, generated: "uuid", type: "uuid" })
  ID: string;
  @Column({ type: "uuid" })
  badge_id: string;
  @Column({ type: "uuid" })
  user_id: string;
  @CreateDateColumn({type: "timestamp"})
  earned_at: Date;
  @ManyToOne(() => Badge, badge => badge.user_badge, { nullable: false })
  @JoinColumn({ name: "badge_id" })
  badge: Relation<Badge>;
  @ManyToOne(() => User, user => user.badges, { nullable: false })
  @JoinColumn({ name: "user_id" })
  user: Relation<User>;
};

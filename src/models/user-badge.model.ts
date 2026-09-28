import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Badge } from "./badge.model.js";

@Entity("user_badge")
export class UserBadge {
  @PrimaryColumn({ primary: true, generated: "uuid", type: "uuid" })
  ID: string;
  @Column()
  badge_id: string;
  @Column()
  user_id: string;
  @Column({type: "timestamp"})
  earned_at: Date;
  @ManyToOne(() => Badge, badge => badge.user_badge, { nullable: false })
  @JoinColumn({ name: "badge_id" })
  badge: Badge;
};

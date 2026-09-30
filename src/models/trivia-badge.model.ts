import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Trivia } from "./trivia.model.js";
import { Badge } from "./badge.model.js";
import { Animal } from "./animal.model.js";

@Entity("trivia_badge")
export class TriviaBadge {
  @PrimaryColumn({ generated: "uuid", type: "uuid" })
  ID: string;
  @Column()
  trivia_id: string;
  @Column()
  badge_id: string;
  @Column()
  min_score: number;
  @ManyToOne(() => Trivia, trivia => trivia.badges, { nullable: false, onDelete: "CASCADE" })
  @JoinColumn({ name: "trivia_id" })
  trivia: Trivia;
  @ManyToOne(() => Badge, badge => badge.trivia)
  @JoinColumn({ name: "badge_id" })
  badge: Badge;
};

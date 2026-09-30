import { type Relation, Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Trivia } from "./trivia.model.js";
import { Badge } from "./badge.model.js";

@Entity("trivia_badge")
export class TriviaBadge {
  @PrimaryColumn({ generated: "uuid", type: "uuid" })
  ID: string;
  @Column({ type: "uuid" })
  trivia_id: string;
  @Column({ type: "uuid" })
  badge_id: string;
  @Column({ type: "integer" })
  min_score: number;
  @ManyToOne(() => Trivia, trivia => trivia.badges, { nullable: false, onDelete: "CASCADE" })
  @JoinColumn({ name: "trivia_id" })
  trivia: Relation<Trivia>;
  @ManyToOne(() => Badge, badge => badge.trivia)
  @JoinColumn({ name: "badge_id" })
  badge: Relation<Badge>;
};

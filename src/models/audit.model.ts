import { Column, CreateDateColumn, Entity, PrimaryColumn } from "typeorm";

/*
C = Create
R = Read
U = Update
D = Delete
L = Login
*/
export type OpType = "C" | "R" | "U" | "D" | "L";

export type TableNames = "user" | "animal" | "ble" | "alternative" | "badge" | "question" | "trivia" | "user_badge" | "trivia_badge" | "trivia_completion";

@Entity({
    name: "audit"
})
export class Audit {
    @PrimaryColumn({type: "uuid", generated: "uuid"})
    ID: string;
    @Column({type: "varchar", nullable: false})
    operation_type: OpType;
    @CreateDateColumn({type: "timestamp"})
    operation_date: Date;
    @Column({type: "uuid", nullable: false})
    entity_ID: string;
    @Column({type: "varchar", nullable: false})
    entity_table_name: TableNames;
    @Column({type: "uuid", nullable: false})
    user_ID: string;
};

import { Column, Entity, PrimaryColumn } from "typeorm";

export type OpType = "C" | "R" | "U" | "D";

export type TableNames = "user" | "animal" | "ble" | "client";

@Entity({
    name: "audit"
})
export class Audit {
    @PrimaryColumn({type: "uuid", generated: "uuid"})
    ID: string;
    @Column({nullable: false})
    operation_type: OpType;
    @Column({type: "timestamp"})
    operation_date: Date;
    @Column({type: "uuid", nullable: false})
    entity_ID: string;
    @Column({nullable: false})
    entity_table_name: TableNames;
    @Column({type: "uuid", nullable: false})
    user_ID: string;
};
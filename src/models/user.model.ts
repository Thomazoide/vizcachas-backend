import { Column, Entity, PrimaryColumn } from "typeorm";

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
}
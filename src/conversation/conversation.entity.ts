import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()

export class Conversation {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: false })
    isGroup: boolean;

    @Column({ nullable: true })
    groupName: string;

    @CreateDateColumn()
    createdAt: Date;
}
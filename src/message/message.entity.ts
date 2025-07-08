import { Conversation } from "src/conversation/conversation.entity";
import { User } from "src/user/user.entity";
import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Message {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Conversation, { onDelete: 'CASCADE' })
    conversation: Conversation;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({name:'userid'})
    sender : User;

    @Column({nullable : true})
    content :string;

     @Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
    })
    sendAt?: Date;
    
      @BeforeInsert()
    private beforeInsert(){
        this.sendAt = new Date();
    }
}
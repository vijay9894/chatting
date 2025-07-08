import { Conversation } from "src/conversation/conversation.entity";
import { User } from "src/user/user.entity";
import { CreateDateColumn, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ConversationParticipant {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Conversation, { onDelete: 'CASCADE' })
    conversation: Conversation;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    user: User;

    @CreateDateColumn()
    createdAt: Date;
}


import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { Conversation } from 'src/conversation/conversation.entity';
import { ConversationParticipant } from 'src/conversationParticipant/conversationParticipant.entity';
import { Message } from 'src/message/message.entity';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'postgres',
  port: 5432,
  username: 'postgres',
  password: '1004',
  database: 'postgres',
  entities: [User, Conversation, ConversationParticipant, Message],
  synchronize: true

}

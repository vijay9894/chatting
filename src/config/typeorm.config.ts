
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { Conversation } from 'src/conversation/conversation.entity';
import { ConversationParticipant } from 'src/conversationParticipant/conversationParticipant.entity';
import { Message } from 'src/message/message.entity';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'Vijay@9894',
  database: 'chat_app',
  entities: [User,Conversation ,ConversationParticipant, Message],
  synchronize: true
}

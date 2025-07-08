import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { ConversationModule } from './conversation/conversation.module';
import { ConversationParticipantModule } from './conversationParticipant/conversationParticipant.module';
import { MessageModule } from './message/message.module';
import { GatewayModule } from './chat/chat.module';

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig),UserModule , ConversationModule , ConversationParticipantModule, MessageModule , GatewayModule ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

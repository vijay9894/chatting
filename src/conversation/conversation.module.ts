import { Module } from "@nestjs/common";
import { ConversationService } from "./conversation.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Conversation } from "./conversation.entity";
import { ConversationParticipant } from "src/conversationParticipant/conversationParticipant.entity";
import { Message } from "src/message/message.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Conversation, ConversationParticipant,Message])],
  providers: [ConversationService],
  exports: [ConversationService],
})
export class ConversationModule {}
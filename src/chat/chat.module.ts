import { Module } from "@nestjs/common";
import { ChatGateway } from "./chat.gateway";
import { ConversationModule } from "src/conversation/conversation.module";
import { MessageModule } from "src/message/message.module";

@Module({
   imports: [ConversationModule ,MessageModule], 
  providers: [ChatGateway],
})
export class GatewayModule{
   
}
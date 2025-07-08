import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Conversation } from "./conversation.entity";
import { In, Repository } from "typeorm";
import { ConversationParticipant } from "src/conversationParticipant/conversationParticipant.entity";
import { Message } from "src/message/message.entity";

@Injectable()
export class ConversationService {
  constructor(
    @InjectRepository(Conversation)
    private readonly conversationRepo: Repository<Conversation>,
    @InjectRepository(ConversationParticipant)
    private readonly participantRepo: Repository<ConversationParticipant>,
    @InjectRepository(Message)
    private readonly messageRepo: Repository<Message>,
  ) { }

  async createOneToOneConversation(senderId: number, receiverId: number, content: string) {

    // const userIds = [userAId , userBId]
    const senderRows = await this.participantRepo.find({
      relations: {
        user: true,
        conversation: true
      },
      where: {
        user: In([
          senderId,
        ]),
      },
    })

    const senderConversationIds = [...new Set(senderRows.map(row => row.conversation.id))];
    console.log(senderConversationIds); // 1 2

    const receiverRows = await this.participantRepo.find({
      relations: {
        user: true,
        conversation: true
      },
      where: {
        user: In([
          receiverId,
        ]),
      },
    })

    const receiverConversationIds = [...new Set(receiverRows.map(row => row.conversation.id))];
    console.log(receiverConversationIds); // 2

    const conversationIds = senderConversationIds.filter(id => receiverConversationIds.includes(id));
    console.log(conversationIds); // 2


    const oneToOneconvos = await this.conversationRepo.find({
      where: {
        id: In([...conversationIds]),
        isGroup: false,
      }
    })

    console.log(oneToOneconvos);

    let conversation: Conversation;
    if (oneToOneconvos.length > 0) {
      conversation = oneToOneconvos[0];
    } else {
      conversation = await this.conversationRepo.save({
        isGroup: false,
      });
      await this.participantRepo.save([
        { user: { id: senderId }, conversation },
        { user: { id: receiverId }, conversation },
      ]);
    }
    console.log(conversation);
    await this.messageRepo.save({
      content,
      conversation,
      sender: { id: senderId }
    })

    return conversation;
  }
}




import { BadRequestException, Injectable } from "@nestjs/common";
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

    try {

      if (!senderId || !receiverId || !content) {
        throw new BadRequestException('Invalid input data');
      }

      if (senderId === receiverId) {
        throw new BadRequestException('Sender and receiver cannot be the same');
      }

      const participantRows = await this.participantRepo.find({
        where: {
          user: In([senderId, receiverId]),
        },
        relations: {
          conversation: true,
        }
      });

      const conversationIds = [...new Set(participantRows.map(row => row.conversation.id))];
      const participantCount = participantRows.reduce((acc, row) => {
        acc[row.conversation.id] = (acc[row.conversation.id] || 0) + 1;
        return acc;
      }, {} as Record<number, number>);

      const oneTooneConvo = await this.conversationRepo.findOne({
        where: {
          id: In(conversationIds),
          isGroup: false,
        }
      });

      let conversation: Conversation;

      if (oneTooneConvo && participantCount[oneTooneConvo.id] === 2) {
        conversation = oneTooneConvo;
      } else {
        conversation = await this.conversationRepo.save({
          isGroup: false,
        });

        console.log(`conversation created with id ${conversation.id}`);

        const participants = this.participantRepo.create([
          { user: { id: senderId }, conversation: { id: conversation.id } },
          { user: { id: receiverId }, conversation: { id: conversation.id } },
        ]);

        await this.participantRepo.save(participants);
        console.log(`participants added ${senderId} and ${receiverId}`);
      }
      await this.messageRepo.save({
        content,
        conversation: { id: conversation.id },
        sender: { id: senderId }
      })

      console.log('message saved');

      return conversation;

    }
    catch (error) {
      console.log('Error in createOneToOneConversation:', error);
    }
  }

  async createGroupConversation(creatorId: number, userIds: number[], groupName: string) {
    let savedParticipants;
    try {
      if (!creatorId || !userIds || userIds.length === 0 || !groupName) {
        throw new BadRequestException('Invalid input data');
      }

      const creatingConversation = await this.conversationRepo.save({
        isGroup: true,
        groupName
      })
      console.log(`Group conversation created with ID ${creatingConversation}`);

      const allUesrIds = [creatorId, ...userIds];

      const participants = allUesrIds.map(userId => ({
        user: { id: userId },
        conversation: { id: creatingConversation.id }
      }));

      console.log('participants added', participants);

      for(const participant of participants) {
        savedParticipants=  await this.participantRepo.save({
           user : {id :participant.user.id},
            conversation : {id : creatingConversation.id}
        });
      }
      console.log('participants saved', savedParticipants);

      return creatingConversation;
    }
    catch (error) {
      console.error('Error in createGroupConversation:', error);
      throw new BadRequestException('Failed to create group conversation');
    }
  }

  async createGroupMessage(isGroup: boolean, conversationId: number, content: string, senderId: number, userIds: number[]) {
    try {
      if (!isGroup || !conversationId || !content || !senderId || !userIds || userIds.length === 0) {
        throw new BadRequestException('Invalid input data');
      }

      // console.log("isGroup", isGroup, "conversationId", conversationId, "content", content, "senderId", senderId, "userIds", userIds);
      if (isGroup)
        await this.messageRepo.save({
          content,
          conversation: { id: conversationId },
          sender: { id: senderId }
        })

    }
    catch (error) {
      console.error('Error in createGroupMessage:', error);
      throw new BadRequestException('Failed to create group message');
    }

  }

}


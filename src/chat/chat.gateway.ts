import { OnModuleInit } from "@nestjs/common";
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { ConversationService } from "../conversation/conversation.service";

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnModuleInit {

    constructor(
        private readonly conversationService: ConversationService,
    ) { }


    @WebSocketServer()
    server: Server;

    private onlineUsers = new Map<number, string>();

    onModuleInit() {
        this.server.on('connection', (socket: Socket) => {
            const userId = Number(socket.handshake.query.userId);
            // const userId = 1;
            if (userId) {
                this.onlineUsers.set(userId, socket.id);
                console.log(`User ${userId} connected as ${socket.id}`);
            }
        });
    }


    @SubscribeMessage('createConversation')
    async handleCreateConversation(
        @MessageBody()
        payload: {
            isGroup: boolean;
            userIds: number[];
            groupName?: string;
        },
        @ConnectedSocket() socket: Socket) {
        //  const creatorId = Number(socket.handshake.query.userId);
        const creatorId = 1;
        let conversation;
        console.log(`User ${creatorId} created a conversation`, payload);

        if (payload.isGroup) {
            console
        } else {

        }

        const participantIds = [...payload.userIds, creatorId];

        // Notify all participants about the new conversation
        participantIds.forEach(userId => {
            const userSocketId = this.onlineUsers.get(userId);
            if (userSocketId) {
                this.server.to(userSocketId).emit('conversationCreated', {
                    creatorId,
                    isGroup: payload.isGroup,
                    groupName: payload.groupName,
                    userIds: payload.userIds
                });
            }
        });

    }

    @SubscribeMessage('newMessage')
    async handleNewMessage(
        @MessageBody()
        payload: {
            senderId: number;
            receiverId: number;
            content: string;
        },
        @ConnectedSocket() socket: Socket
    ) {
        const { senderId, receiverId, content } = payload;

        let conversation = await this.conversationService.createOneToOneConversation(senderId, receiverId, content);
        if (!conversation) {
            console.error('Conversation not found or created');
            return;
        }
        const receiverSocketId = this.onlineUsers.get(receiverId);

        console.log('inside handleNewMessage', {
            conversationId: conversation.id
        });

        if (receiverSocketId) {
            this.server.to(receiverSocketId).emit('receiveMessage', {
                conversationId: conversation.id,
                senderId,
                content,
                createdAt: conversation.createdAt,
            });
        }

        // Notify the sender about the sent message
        socket.emit('messageSent', {
            conversationId: conversation.id,
            receiverId: receiverId,
            content: content,
            createdAt: conversation.createdAt,
        });
    }

}
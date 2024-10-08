import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { MessagesService } from '../../messages/messages.service';
import { CreateMessageDto } from '../../messages/dto/create-message.dto';

@WebSocketGateway({ cors: true })
@Injectable()
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly messageService: MessagesService) {}

  handleConnection(client: Socket) {
    console.log('Client connected:', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
  }

  @SubscribeMessage('joinTeam')
  handleJoinTeam(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string; teamId: string },
  ) {
    const { roomId, teamId } = data;
    const teamRoom = `${roomId}-${teamId}`;
    client.join(teamRoom);
    console.log(`Client ${client.id} joined room ${teamRoom}`);
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: CreateMessageDto,
  ) {
    const { roomId, teamId } = data;
    const message = await this.messageService.saveMessage(data);
    const teamRoom = `${roomId}-${teamId}`;
    this.server.to(teamRoom).emit('receiveMessage', message);
  }
}

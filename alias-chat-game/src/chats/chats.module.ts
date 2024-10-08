import { Module } from '@nestjs/common';
import { ChatGateway } from './gateways/chat.gateway';
import { MessagesModule } from '../messages/messages.module';

@Module({
  imports: [MessagesModule],
  providers: [ChatGateway],
})
export class ChatsModule {}

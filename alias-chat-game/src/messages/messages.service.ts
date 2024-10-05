import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message } from './schemas/message.schema';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<Message>,
  ) {}

  // async createMessage(createMessageDto: CreateMessageDto) {
  //   const { text } = createMessageDto;
  //   const message = new this.messageModel({ userId: '', text });
  //   return await message.save();
  // }

  async getMessageByTeamId(teamId: string) {
    return this.messageModel.find({ teamId });
  }

  // TODO fix with CreateMessage

  async saveMessage(data: {
    roomId: string;
    teamId: string;
    text: string;
    userId: string;
  }) {
    const message = new this.messageModel(data);
    return await message.save();
  }
}

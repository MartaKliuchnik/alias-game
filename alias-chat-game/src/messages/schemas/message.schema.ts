import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type MessageDocument = HydratedDocument<Message>;

@Schema()
export class Message {
  @Prop({ type: Types.ObjectId, ref: 'users', required: true })
  userId: Types.ObjectId;

  @Prop({ type: String, required: true })
  text: string;

  @Prop({ type: Types.ObjectId, ref: 'rooms', required: true })
  roomId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'teams', required: true })
  teamId: Types.ObjectId;

  @Prop({ type: Date, default: Date.now })
  timestamp: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);

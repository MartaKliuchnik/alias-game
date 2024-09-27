import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ChatDocument = HydratedDocument<Chat>;

@Schema()
export class Chat {
  @Prop({ type: [Types.ObjectId], ref: 'messages', required: true })
  messageIds: Types.ObjectId[];

  @Prop({ type: Types.ObjectId, ref: 'users', required: true })
  writeUserId: Types.ObjectId;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
@Schema()
export class Chat extends Document {}

export const ChatSchema = SchemaFactory.createForClass(Chat);

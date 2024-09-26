import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
@Schema()
export class Room extends Document{}

export const RoomSchema = SchemaFactory.createForClass(Room);

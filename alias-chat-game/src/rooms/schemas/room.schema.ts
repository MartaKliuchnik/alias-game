import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type RoomDocument = HydratedDocument<Room>;

@Schema()
export class Room {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: [Types.ObjectId], required: true, default: [] })
  joinedUsers: Types.ObjectId[];

  @Prop({ type: [Types.ObjectId], default: [] })
  teams: Types.ObjectId[];

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({
    type: Number,
    required: true,
    validate: {
      validator: Number.isInteger,
      message: 'It is not an integer value',
    },
  })
  turnTime: number;
}

export const RoomSchema = SchemaFactory.createForClass(Room);

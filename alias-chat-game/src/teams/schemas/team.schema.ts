import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

@Schema()
export class Team {
  @Prop({ type: Types.ObjectId, ref: 'rooms', required: true })
  roomId: Types.ObjectId;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: Number, default: 0 })
  teamScore: number;

  @Prop({ type: Types.ObjectId, ref: 'words' })
  selectedWord: Types.ObjectId;

  @Prop({ type: [Types.ObjectId], ref: 'users', required: true })
  players: Types.ObjectId[];

  @Prop({ type: Types.ObjectId })
  chatId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'users' })
  describer: Types.ObjectId;

  @Prop({ type: Boolean, default: false })
  isTurn: boolean;

  @Prop({ type: [String], default: [] })
  tryedWords: string[];

  @Prop({ type: Types.ObjectId, ref: 'users' })
  teamLeader: Types.ObjectId;
}

export type TeamDocument = HydratedDocument<Team>;
export const TeamSchema = SchemaFactory.createForClass(Team);

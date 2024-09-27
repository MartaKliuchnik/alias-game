import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ type: String, required: true, unique: true })
  username: string;

  @Prop({ type: String, required: true })
  hashedPassword: string;

  @Prop({ type: String, required: true })
  salt: string;

  @Prop({ type: Number, default: 0 })
  totalScore: number;

  @Prop({ type: Number, default: 0 })
  playedGame: number;

  @Prop({ type: Number, default: 0 })
  winsCount: number;
}

export const UserSchema = SchemaFactory.createForClass(User);

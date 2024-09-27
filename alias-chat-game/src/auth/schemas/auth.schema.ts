import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

@Schema()
export class Auth {
  @Prop({ type: Types.ObjectId, ref: 'users', required: true })
  userId: Types.ObjectId;

  @Prop({ type: String, required: true })
  refreshToken: string;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;
}

export type AuthDocument = HydratedDocument<Auth>;
export const AuthSchema = SchemaFactory.createForClass(Auth);

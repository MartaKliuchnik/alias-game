import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

/**
 * Auth data schema.
 */
@Schema()
export class Auth {
  /**
   * User's ID.
   */
  @Prop({ type: Types.ObjectId, ref: 'users', required: true })
  userId: Types.ObjectId;

  /**
   * User's refresh token string.
   */
  @Prop({ type: String, required: true })
  refreshToken: string;

  /**
   * Date and time when refresh token was created.
   */
  @Prop({ type: Date, default: Date.now })
  createdAt: Date;
}

export type AuthDocument = HydratedDocument<Auth>;
export const AuthSchema = SchemaFactory.createForClass(Auth);

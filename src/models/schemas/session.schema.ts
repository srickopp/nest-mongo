import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SessionDocument = Session & Document;

@Schema()
export class Session {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  token: string;

  @Prop({
    default: true,
  })
  isActive: boolean;

  @Prop()
  password: string;
}

export const SessionSchema = SchemaFactory.createForClass(Session);

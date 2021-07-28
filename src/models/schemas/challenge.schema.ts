import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { StudentChallenge } from './studentChallenge.schema';

export type UserDocument = Challenge & Document;

@Schema({ timestamps: true })
export class Challenge {
  @Prop({ type: Types.ObjectId })
  _id: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'StudentChallenge' }] })
  studentChallenges: StudentChallenge[];
}

export const UserSchema = SchemaFactory.createForClass(Challenge);

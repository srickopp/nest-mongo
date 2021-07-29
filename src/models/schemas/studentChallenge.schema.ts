import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Challenge } from './challenge.schema';
import { User } from './user.schema';

export type StudentChallengeDocument = StudentChallenge & Document;

@Schema({ timestamps: true })
export class StudentChallenge {
  _id: string;

  @Prop({ type: Types.ObjectId, ref: Challenge.name })
  challenge: Challenge;

  @Prop({ type: Types.ObjectId, ref: User.name })
  student: User;

  @Prop({ type: Types.ObjectId, ref: User.name })
  reviewer: User;

  @Prop()
  solution: string;

  @Prop()
  grade: number;

  @Prop()
  comment: string;

  @Prop({ default: false })
  isDone: boolean;

  @Prop({ default: false })
  isReviewed: boolean;
}

export const StudentChallengeSchema =
  SchemaFactory.createForClass(StudentChallenge);

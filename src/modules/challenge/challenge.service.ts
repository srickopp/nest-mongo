import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Challenge,
  ChallengeDocument,
} from 'src/models/schemas/challenge.schema';
import {
  StudentChallenge,
  StudentChallengeDocument,
} from 'src/models/schemas/studentChallenge.schema';
import { User, UserDocument } from 'src/models/schemas/user.schema';

@Injectable()
export default class ChallengeService {
  public constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Challenge.name)
    private challengeModel: Model<ChallengeDocument>,
    @InjectModel(StudentChallenge.name)
    private studentChallengeModel: Model<StudentChallengeDocument>,
  ) {}
}

import { HttpException, Injectable } from '@nestjs/common';
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
import { CreateChallenge } from './dto/challenge.dto';

@Injectable()
export default class ChallengeService {
  public constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Challenge.name)
    private challengeModel: Model<ChallengeDocument>,
    @InjectModel(StudentChallenge.name)
    private studentChallengeModel: Model<StudentChallengeDocument>,
  ) {}

  async createChallenge(data: CreateChallenge): Promise<Challenge> {
    // Validate Challenge
    const isDuplicateChallenge = await this.challengeModel.countDocuments({
      description: data.description,
    });

    if (isDuplicateChallenge > 0) {
      throw new HttpException(
        {
          message: 'Challenge already exist, please check existing challenge',
        },
        400,
      );
    }

    const challenge = await this.challengeModel.create(data);
    return challenge;
  }

  async getChallenges(filter: string): Promise<Challenge[]> {
    const filterQuery = {};
    filterQuery['deletedAt'] = null;
    if (filter) {
      filterQuery['description'] = { $regex: new RegExp(filter, 'i') };
    }

    const challenges = await this.challengeModel.find(filterQuery);

    if (challenges.length == 0) {
      throw new HttpException(
        {
          message: 'Challenge not found',
        },
        404,
      );
    }

    return challenges;
  }

  async getChallenge(id: string): Promise<Challenge> {
    return await this.findOneOrFail(id);
  }

  async updateChallenge(id: string, data: CreateChallenge): Promise<boolean> {
    await this.findOneOrFail(id);
    const isDuplicateChallenge = await this.challengeModel.countDocuments({
      description: data.description,
      _id: {
        $ne: id,
      },
    });

    if (isDuplicateChallenge > 0) {
      throw new HttpException(
        {
          message: 'Challenge already exist, please check existing challenge',
        },
        400,
      );
    }

    await this.challengeModel.findByIdAndUpdate(id, {
      description: data.description,
    });

    return true;
  }

  async deleteChallenge(id: string): Promise<boolean> {
    await this.findOneOrFail(id);
    await this.challengeModel.findOneAndUpdate({
      deletedAt: new Date(),
    });
    return true;
  }

  private async findOneOrFail(id: string): Promise<Challenge> {
    const challenge = await this.challengeModel
      .findOne({
        _id: id,
        deletedAt: null,
      })
      .catch(() => {
        throw new HttpException(
          {
            message: 'Challenge not found',
          },
          404,
        );
      });

    if (!challenge) {
      throw new HttpException(
        {
          message: 'Challenge not found',
        },
        404,
      );
    }

    return challenge;
  }
}

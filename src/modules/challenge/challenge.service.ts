import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model, Types } from 'mongoose';
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

  // Manage Challenge
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

  // Assign Challenge
  async assignChallenge(
    challengeId: any,
    teacher: User,
    studentId: any,
  ): Promise<StudentChallenge> {
    await this.findOneOrFail(challengeId);
    // Validate challenge is already assign to the student?
    const isAlreadyAssigned = await this.studentChallengeModel.findOne({
      challenge: challengeId,
      student: studentId,
    });

    if (isAlreadyAssigned) {
      throw new HttpException(
        {
          message: 'Student already assigned to this challenge',
        },
        400,
      );
    }

    const studentChallenge = await this.studentChallengeModel.create({
      challenge: challengeId,
      student: studentId,
      reviewer: teacher._id,
      solution: '',
    });

    // Push to challenge doc
    await this.challengeModel.updateOne(
      {
        _id: challengeId,
      },
      {
        $push: {
          studentChallenges: studentChallenge._id,
        },
      },
    );

    // Push to teacher doc
    await this.userModel.updateOne(
      {
        _id: teacher._id,
      },
      {
        $push: {
          reviewChallenge: studentChallenge._id,
        },
      },
    );

    // Push to student doc
    await this.userModel.updateOne(
      {
        _id: studentId,
      },
      {
        $push: {
          studentChallenge: studentChallenge._id,
        },
      },
    );

    return studentChallenge;
  }

  async getReviewChallenge(teacherId): Promise<StudentChallenge[]> {
    return await this.studentChallengeModel
      .find({
        reviewer: teacherId,
      })
      .populate('challenge', { description: 1 })
      .populate('student', { name: 1 });
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
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { ChallengeStatus } from 'src/enum/challengeStatus.enum';
import { Role } from 'src/enum/role.enum';
import { BearerHttpGuard } from 'src/guard/http.guard';
import { TeacherGuard } from 'src/guard/teacher.guard';
import { User } from 'src/models/schemas/user.schema';
import ChallengeService from './challenge.service';
import {
  AssignChallenge,
  CreateChallenge,
  ReviewChallenge,
  SolveChallenge,
} from './dto/challenge.dto';

@Controller('challenge')
export default class ChallengeController {
  constructor(private readonly challengeService: ChallengeService) {}

  /**
   * This function will handle to return a list of challenge
   * only teacher can see and do this actions
   * @param filter
   * @param res
   */
  @ApiTags('Challenge-Teacher')
  @ApiQuery({
    name: 'filter',
    required: false,
  })
  @ApiBearerAuth()
  @UseGuards(TeacherGuard)
  @Get('/')
  async getChallenges(@Query('filter') filter: string, @Res() res: Response) {
    const getChallenges = await this.challengeService.getChallenges(filter);
    return res.status(200).send({
      message: 'List of challenge',
      data: getChallenges,
    });
  }

  /**
   * This one is endpoint to create a challenge that create by teacher
   * and then teacher can assigne a challenge to the students
   * @param body
   * @param res
   */
  @ApiTags('Challenge-Teacher')
  @ApiBearerAuth()
  @UseGuards(TeacherGuard)
  @Post('/')
  async createChallenge(@Body() body: CreateChallenge, @Res() res: Response) {
    const createdChallenge = await this.challengeService.createChallenge(body);
    return res.status(201).send({
      message: 'Success create challenge',
      data: createdChallenge,
    });
  }

  /**
   * This endpoint is used to update the description for a challenge
   * only teacher can do this actions
   * @param id
   * @param body
   * @param res
   */
  @ApiTags('Challenge-Teacher')
  @ApiBearerAuth()
  @UseGuards(TeacherGuard)
  @Put('/:id')
  async updateChallenge(
    @Param('id') id: string,
    @Body() body: CreateChallenge,
    @Res() res: Response,
  ) {
    const updateChallenge = await this.challengeService.updateChallenge(
      id,
      body,
    );
    return res.status(200).send({
      message: updateChallenge
        ? 'Success update challenge'
        : 'Failed update challenge',
    });
  }

  /**
   * This endpoint will handle about deleting a challenge
   * only teacher can do this actions
   * @param id
   * @param res
   */
  @ApiTags('Challenge-Teacher')
  @ApiBearerAuth()
  @UseGuards(TeacherGuard)
  @Delete('/:id')
  async deleteChallenge(@Param('id') id: string, @Res() res: Response) {
    const deleteChallenge = await this.challengeService.deleteChallenge(id);
    return res.status(200).send({
      message: deleteChallenge
        ? 'Success delete challenge'
        : 'Failed delete challenge',
    });
  }

  /**
   * Teacher can assign the student to a challenge through this endpoint
   * first thing first, teacher should create a challenge if there's no
   * existing challenge
   * @param body
   * @param res
   */
  @ApiTags('Challenge-Teacher')
  @ApiBearerAuth()
  @UseGuards(TeacherGuard)
  @Post('/assign-challenge')
  async assignChallenge(@Body() body: AssignChallenge, @Res() res: Response) {
    const userInfo: User = res.locals.session.user;
    const assignChallenge = await this.challengeService.assignChallenge(
      body.challengeId,
      userInfo,
      body.studentId,
    );

    return res.status(201).send({
      message: 'Success assign challenge',
      data: assignChallenge,
    });
  }

  /**
   * With this endpoint teacher can see a list of student challenge,
   * that they assign to the student.
   * Also can filter the student challenge by status,
   * unComplete: Student not do the assignment yet.
   * complete: Student already done with the assignment & ready to review
   * reviewed: Student challenge with review
   * @param status
   * @param res
   */
  @ApiTags('Challenge-Teacher')
  @ApiBearerAuth()
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ChallengeStatus,
  })
  @UseGuards(TeacherGuard)
  @Get('/review-challenge')
  async getReviewChallenge(
    @Query('status') status: ChallengeStatus,
    @Res() res: Response,
  ) {
    const userInfo: User = res.locals.session.user;
    const reviewChallenges = await this.challengeService.getReviewChallenge(
      userInfo._id,
      status,
    );

    return res.status(201).send({
      message: 'Success get challenge',
      data: reviewChallenges,
    });
  }

  /**
   * Teacher can give a review to student assigmnet with this endpoint.
   * @param body
   * @param res
   */
  @ApiTags('Challenge-Teacher')
  @ApiBearerAuth()
  @UseGuards(TeacherGuard)
  @Post('/review-challenge')
  async review(@Body() body: ReviewChallenge, @Res() res: Response) {
    const userInfo: User = res.locals.session.user;
    const reviewChallenge = await this.challengeService.reviewChallenge(
      userInfo._id,
      body,
    );

    return res.status(201).send({
      message: 'Success solve challenge',
      data: reviewChallenge,
    });
  }

  /**
   * With this endpoint student can see a list of student challenge,
   * that assigned to them
   * Also can filter the student challenge by status,
   * unComplete: Student not do the assignment yet.
   * complete: Student already done with the assignment & ready to review
   * reviewed: Student challenge with review
   * @param status
   * @param res
   */
  @ApiTags('Challenge-Student')
  @ApiBearerAuth()
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ChallengeStatus,
  })
  @UseGuards(BearerHttpGuard)
  @Get('/student-challenge')
  async getStudentChallenge(
    @Query('status') status: ChallengeStatus,
    @Res() res: Response,
  ) {
    const userInfo: User = res.locals.session.user;
    if (userInfo.role != Role.Student) {
      throw new HttpException(
        {
          message: 'Only student can access this information',
        },
        403,
      );
    }
    const studentChallenges = await this.challengeService.getStudentChallenge(
      userInfo._id,
      status,
    );

    return res.status(201).send({
      message: 'Success get challenge',
      data: studentChallenges,
    });
  }

  /**
   * With this endpoint student can send their solution
   * to solve the challenge
   * @param body
   * @param res
   */
  @ApiTags('Challenge-Student')
  @ApiBearerAuth()
  @UseGuards(BearerHttpGuard)
  @Post('/student-challenge')
  async solveChallenge(@Body() body: SolveChallenge, @Res() res: Response) {
    const userInfo: User = res.locals.session.user;
    if (userInfo.role != Role.Student) {
      throw new HttpException(
        {
          message: 'Only student can access this information',
        },
        403,
      );
    }
    const studentChallenge = await this.challengeService.solveChallenge(
      userInfo._id,
      body,
    );

    return res.status(201).send({
      message: 'Success solve challenge',
      data: studentChallenge,
    });
  }

  /**
   * This endpoint will handle and return the detail of challenge
   * @param id
   * @param res
   */
  @ApiTags('Challenge')
  @ApiBearerAuth()
  @UseGuards(BearerHttpGuard)
  @Get('/:id')
  async getChallenge(@Param('id') id: string, @Res() res: Response) {
    const getChallenge = await this.challengeService.getChallenge(id);
    return res.status(200).send({
      message: 'Get single challenge',
      data: getChallenge,
    });
  }
}

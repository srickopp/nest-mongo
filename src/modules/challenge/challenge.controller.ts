import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { BearerHttpGuard } from 'src/guard/http.guard';
import { TeacherGuard } from 'src/guard/teacher.guard';
import { User } from 'src/models/schemas/user.schema';
import ChallengeService from './challenge.service';
import { AssignChallenge, CreateChallenge } from './dto/challenge.dto';

@Controller('challenge')
export default class ChallengeController {
  constructor(private readonly challengeService: ChallengeService) {}

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

  @ApiTags('Challenge-Teacher')
  @ApiBearerAuth()
  @UseGuards(TeacherGuard)
  @Get('/review-challenge')
  async getReviewChallege(@Res() res: Response) {
    const userInfo: User = res.locals.session.user;
    const reviewChallenges = await this.challengeService.getReviewChallenge(
      userInfo._id,
    );

    return res.status(201).send({
      message: 'Success assign challenge',
      data: reviewChallenges,
    });
  }

  @ApiTags('Challenge')
  @ApiQuery({
    name: 'filter',
    required: false,
  })
  @ApiBearerAuth()
  @UseGuards(BearerHttpGuard)
  @Get('/')
  async getChallenges(@Query('filter') filter: string, @Res() res: Response) {
    const getChallenges = await this.challengeService.getChallenges(filter);
    return res.status(200).send({
      message: 'List of challenge',
      data: getChallenges,
    });
  }

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
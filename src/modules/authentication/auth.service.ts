import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { Session } from 'src/models/schemas/session.schema';
import { User } from 'src/models/schemas/user.schema';
import { v4 as uuidv4 } from 'uuid';
import { LoginDto, RegisterDto } from './dto/auth.dto';

@Injectable()
export default class AuthService {
  public constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Session.name) private sessionModel: Model<Session>,
  ) {}

  async validateToken(token) {
    const session = await this.sessionModel
      .findOne({
        token: token,
        isActive: true,
      })
      .populate('user', {
        name: 1,
        role: 1,
      });

    if (!session) {
      return {
        success: false,
        message: 'INVALID_TOKEN',
      };
    }

    if (session.user) {
      session.user.password = undefined;
    }

    return {
      success: true,
      session,
    };
  }

  async login(data: LoginDto): Promise<{
    status: number;
    message: string;
    data?: {
      profile: User;
      session: Session;
    };
  }> {
    const user = await this.userModel.findOne(
      {
        email: data.email,
      },
      {
        name: 1,
        role: 1,
        password: 1,
      },
    );

    if (!user) {
      return {
        status: 400,
        message: 'DATA_NOT_FOUND',
      };
    }

    // Validate Password
    const match = await bcrypt.compare(data.password, user.password);
    if (!match) {
      return {
        status: 400,
        message: 'INVALID_PASSWORD',
      };
    }

    // Create Session
    const session = await this.createSession(user);
    user.password = undefined;

    return {
      status: 200,
      message: 'SUCCESS_LOGIN',
      data: {
        profile: user,
        session,
      },
    };
  }

  async register(data: RegisterDto): Promise<{
    status: number;
    message: string;
    data?: {
      user: User;
    };
  }> {
    // Validation email
    const validateEmail = await this.registerValidation(data);
    if (validateEmail.success == false) {
      return {
        status: 400,
        message: validateEmail.message,
      };
    }

    const user = await this.userModel.create({
      name: data.name,
      role: data.role,
      email: data.email,
      password: bcrypt.hashSync(data.password, 10),
    });
    delete user.password;

    // Get Token
    return {
      status: 200,
      message: 'REGISTER_SUCCESS',
      data: {
        user,
      },
    };
  }

  private async registerValidation(data: RegisterDto): Promise<{
    success: boolean;
    message?: string;
  }> {
    const isEmailExist = await this.userModel.countDocuments({
      email: data.email,
    });

    if (isEmailExist > 0) {
      return {
        success: false,
        message: 'EMAIL_ALREADY_EXIST',
      };
    }

    return {
      success: true,
    };
  }

  private async createSession(user: User): Promise<Session> {
    const token = uuidv4();
    const session = await this.sessionModel.create({
      token,
      user: user._id,
      isActive: true,
    });

    await this.userModel.updateOne(
      {
        _id: user._id,
      },
      {
        $push: {
          sessions: session._id,
        },
      },
    );

    return session;
  }
}

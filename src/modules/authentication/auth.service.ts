import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { Session, SessionDocument } from 'src/models/schemas/session.schema';
import { User, UserDocument } from 'src/models/schemas/user.schema';
import { v4 as uuidv4 } from 'uuid';
import { LoginDto, RegisterDto } from './dto/auth.dto';

@Injectable()
export default class AuthService {
  public constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Session.name) private sessionModel: Model<SessionDocument>,
  ) {}

  async validateToken(token) {
    const session = await this.sessionModel.findOne({
      token: token,
      isActive: true,
    });

    if (!session) {
      return {
        success: false,
        message: 'INVALID_TOKEN',
      };
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
    const user = await this.userModel.findOne({
      email: data.email,
    });

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
    const session = await this.createSession(user._id);
    delete user.password;

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
    const isEmailExist = await this.userModel.count({
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

  private async createSession(userId: string): Promise<Session> {
    const token = uuidv4();
    const session = await this.sessionModel.create({
      token,
      userId: userId,
      isActive: true,
    });

    return session;
  }
}
import { Body, Controller, Post, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import AuthService from './auth.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async login(@Body() body: LoginDto, @Res() res: Response) {
    const login = await this.authService.login(body);
    return res.status(login.status).send({
      message: login.message,
      data: login.data,
    });
  }

  @Post('/register')
  async register(@Body() body: RegisterDto, @Res() res: Response) {
    const register = await this.authService.register(body);
    return res.status(register.status).send({
      message: register.message,
      data: register.data,
    });
  }
}

import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
} from '@nestjs/common';
import AuthService from 'src/modules/authentication/auth.service';

@Injectable()
export class TeacherGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (context.getType() !== 'http') {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    const rawToken = request.headers.authorization;

    if (rawToken === undefined) {
      throw new HttpException(
        {
          success: false,
          message: 'INVALID_TOKEN',
        },
        403,
      );
    }

    const filterBearer = rawToken.split('Bearer');

    if (filterBearer[1] === undefined) {
      throw new HttpException(
        {
          success: false,
          message: 'INVALID_TOKEN',
        },
        403,
      );
    }

    const cleanToken = filterBearer[1].trim();

    const session = await this.authService.validateToken(cleanToken);
    if (session.success == false) {
      throw new HttpException(
        {
          success: false,
          message: 'INVALID_TOKEN',
        },
        403,
      );
    }

    if (session.session.user.role != 'TEACHER') {
      throw new HttpException(
        {
          message: "You're not authorized to do this action.",
        },
        403,
      );
    }

    try {
      response.locals = {
        session: session.session,
      };

      return true;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        {
          success: false,
          message: 'INTERNAL_SERVER_ERROR',
        },
        500,
      );
    }
  }
}

import {
  Controller,
  Post,
  Body,
  Inject,
  Res,
  Get,
  Session,
  UnauthorizedException,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Inject(JwtService)
  private jwtService: JwtService;

  @Post('login')
  async login(
    @Body() user: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const foundUser = await this.userService.login(user);

    if (foundUser) {
      const access_token = await this.jwtService.signAsync(
        {
          user: {
            id: foundUser.id,
            username: foundUser.username,
          },
        },
        {
          expiresIn: '30m',
        },
      );
      const refresh_token = await this.jwtService.signAsync({
        userId: foundUser.id,
      });
      return {
        access_token,
        refresh_token,
      };
    } else {
      return 'login fail';
    }
  }

  @Post('session-login')
  async sessionLogin(
    @Body() user: LoginDto,
    @Session() session: Record<string, any>,
  ) {
    const foundUser = await this.userService.sessionLogin(user);

    session.user = {
      username: foundUser.username,
    };

    return 'success';
  }

  @Post('register')
  async register(@Body() user: RegisterDto) {
    return await this.userService.register(user);
  }

  @Get('refresh')
  async refresh(@Query('refresh_token') refreshToken: string) {
    try {
      const data = this.jwtService.verify(refreshToken);

      const user = await this.userService.findUserById(data.userId);

      const access_token = this.jwtService.sign(
        {
          userId: user.id,
          username: user.username,
        },
        {
          expiresIn: '30m',
        },
      );

      const refresh_token = this.jwtService.sign(
        {
          userId: user.id,
        },
        {
          expiresIn: '7d',
        },
      );

      return {
        access_token,
        refresh_token,
      };
    } catch (e) {
      throw new UnauthorizedException('token 已失效，请重新登录');
    }
  }

  @Get('init')
  async initData() {
    await this.userService.initData();
    return 'done';
  }
}

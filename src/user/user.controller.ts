import {
  Controller,
  Post,
  Body,
  Inject,
  Res,
  Get,
  Session,
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
      const token = await this.jwtService.signAsync({
        user: {
          id: foundUser.id,
          username: foundUser.username,
        },
      });
      res.setHeader('Authorization', token);
      return 'login success';
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

  @Get('init')
  async initData() {
    await this.userService.initData();
    return 'done';
  }
}

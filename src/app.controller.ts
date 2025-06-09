import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { LoginGuard } from './login.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('anyone') // 无需权限就能访问
  anyone(): string {
    return 'anyone can access this route';
  }

  @UseGuards(LoginGuard)
  @Get('someone') // 需要登录才能访问
  someone(): string {
    return 'only logged in users can access this route';
  }
}

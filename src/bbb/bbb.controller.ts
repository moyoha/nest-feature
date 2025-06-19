import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { BbbService } from './bbb.service';
import { CreateBbbDto } from './dto/create-bbb.dto';
import { UpdateBbbDto } from './dto/update-bbb.dto';
import { SessionLoginGuard } from 'src/session-login.guard';

@Controller('bbb')
export class BbbController {
  constructor(private readonly bbbService: BbbService) {}

  @Post()
  @UseGuards(SessionLoginGuard)
  create(@Body() createBbbDto: CreateBbbDto) {
    return this.bbbService.create(createBbbDto);
  }

  @Get()
  @UseGuards(SessionLoginGuard)
  findAll() {
    return this.bbbService.findAll();
  }

  @Get(':id')
  @UseGuards(SessionLoginGuard)
  findOne(@Param('id') id: string) {
    return this.bbbService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(SessionLoginGuard)
  update(@Param('id') id: string, @Body() updateBbbDto: UpdateBbbDto) {
    return this.bbbService.update(+id, updateBbbDto);
  }

  @Delete(':id')
  @UseGuards(SessionLoginGuard)
  remove(@Param('id') id: string) {
    return this.bbbService.remove(+id);
  }
}

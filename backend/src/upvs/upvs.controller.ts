import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UpvsService } from './upvs.service';
import { CreateUpvDto } from './dto/create-upv.dto';

@ApiTags('upvs')
@Controller('upvs')
export class UpvsController {
  constructor(private readonly upvsService: UpvsService) {}

  @Get()
  findAll() {
    return this.upvsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.upvsService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateUpvDto) {
    return this.upvsService.create(dto);
  }
}

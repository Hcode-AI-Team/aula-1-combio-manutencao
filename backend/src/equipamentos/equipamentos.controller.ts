import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { EquipamentosService } from './equipamentos.service';
import { CreateEquipamentoDto } from './dto/create-equipamento.dto';

@ApiTags('equipamentos')
@Controller('equipamentos')
export class EquipamentosController {
  constructor(private readonly equipamentosService: EquipamentosService) {}

  @Get()
  @ApiQuery({ name: 'upvId', required: false, type: Number })
  findAll(@Query('upvId') upvId?: string) {
    const parsed = upvId ? Number(upvId) : undefined;
    return this.equipamentosService.findAll(parsed);
  }

  @Post()
  create(@Body() dto: CreateEquipamentoDto) {
    return this.equipamentosService.create(dto);
  }
}

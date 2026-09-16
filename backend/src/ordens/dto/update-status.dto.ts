import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { StatusOrdem } from '../ordem-manutencao.entity';

export class UpdateStatusDto {
  @ApiProperty({ enum: ['aberta', 'em_execucao', 'concluida', 'cancelada'] })
  @IsEnum(['aberta', 'em_execucao', 'concluida', 'cancelada'])
  status: StatusOrdem;
}

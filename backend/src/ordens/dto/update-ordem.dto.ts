import {
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { StatusOrdem, TipoOrdem } from '../ordem-manutencao.entity';

export class UpdateOrdemDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  descricao?: string;

  @ApiPropertyOptional({ enum: ['preventiva', 'corretiva', 'preditiva'] })
  @IsOptional()
  @IsEnum(['preventiva', 'corretiva', 'preditiva'])
  tipo?: TipoOrdem;

  @ApiPropertyOptional({
    enum: ['aberta', 'em_execucao', 'concluida', 'cancelada'],
  })
  @IsOptional()
  @IsEnum(['aberta', 'em_execucao', 'concluida', 'cancelada'])
  status?: StatusOrdem;

  @ApiPropertyOptional({ minimum: 1, maximum: 3 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(3)
  prioridade?: 1 | 2 | 3;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  custoEstimado?: number;
}

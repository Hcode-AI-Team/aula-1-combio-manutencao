import { IsEnum, IsInt, IsNumber, IsString, Max, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TipoOrdem } from '../ordem-manutencao.entity';

export class CreateOrdemDto {
  @ApiProperty()
  @IsString()
  numero: string;

  @ApiProperty()
  @IsString()
  descricao: string;

  @ApiProperty({ enum: ['preventiva', 'corretiva', 'preditiva'] })
  @IsEnum(['preventiva', 'corretiva', 'preditiva'])
  tipo: TipoOrdem;

  @ApiProperty({ minimum: 1, maximum: 3 })
  @IsInt()
  @Min(1)
  @Max(3)
  prioridade: 1 | 2 | 3;

  @ApiProperty()
  @IsInt()
  equipamentoId: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  custoEstimado: number;
}

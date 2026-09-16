import { IsEnum, IsInt, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TipoEquipamento } from '../equipamento.entity';

export class CreateEquipamentoDto {
  @ApiProperty()
  @IsString()
  tag: string;

  @ApiProperty({
    enum: ['caldeira', 'turbina', 'esteira', 'gerador', 'bomba'],
  })
  @IsEnum(['caldeira', 'turbina', 'esteira', 'gerador', 'bomba'])
  tipo: TipoEquipamento;

  @ApiProperty()
  @IsInt()
  upvId: number;
}

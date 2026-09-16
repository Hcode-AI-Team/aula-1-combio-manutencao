import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdemManutencao } from './ordem-manutencao.entity';
import { OrdensController } from './ordens.controller';
import { OrdensService } from './ordens.service';
import { Equipamento } from '../equipamentos/equipamento.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrdemManutencao, Equipamento])],
  controllers: [OrdensController],
  providers: [OrdensService],
  exports: [OrdensService],
})
export class OrdensModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RelatoriosController } from './relatorios.controller';
import { RelatoriosService } from './relatorios.service';
import { Upv } from '../upvs/upv.entity';
import { Equipamento } from '../equipamentos/equipamento.entity';
import { OrdemManutencao } from '../ordens/ordem-manutencao.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Upv, Equipamento, OrdemManutencao])],
  controllers: [RelatoriosController],
  providers: [RelatoriosService],
})
export class RelatoriosModule {}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Upv } from '../upvs/upv.entity';
import { Equipamento } from '../equipamentos/equipamento.entity';
import { OrdemManutencao } from '../ordens/ordem-manutencao.entity';

export interface RelatorioOrdensPorUpv {
  nome: string;
  totalOrdens: number;
  ordensAbertas: number;
  custoEstimadoTotal: number;
}

@Injectable()
export class RelatoriosService {
  constructor(
    @InjectRepository(Upv)
    private readonly upvRepository: Repository<Upv>,
    @InjectRepository(Equipamento)
    private readonly equipamentoRepository: Repository<Equipamento>,
    @InjectRepository(OrdemManutencao)
    private readonly ordemRepository: Repository<OrdemManutencao>,
  ) {}

  async ordensPorUpv(): Promise<RelatorioOrdensPorUpv[]> {
    const upvs = await this.upvRepository.find();
    const resultado: RelatorioOrdensPorUpv[] = [];

    for (const upv of upvs) {
      const equipamentos = await this.equipamentoRepository.find({
        where: { upv: { id: upv.id } },
      });

      let totalOrdens = 0;
      let ordensAbertas = 0;
      let custoEstimadoTotal = 0;

      for (const equipamento of equipamentos) {
        const ordens = await this.ordemRepository.find({
          where: { equipamento: { id: equipamento.id } },
        });
        totalOrdens += ordens.length;
        ordensAbertas += ordens.filter(
          (ordem) => ordem.status === 'aberta',
        ).length;
        custoEstimadoTotal += ordens.reduce(
          (soma, ordem) => soma + ordem.custoEstimado,
          0,
        );
      }

      resultado.push({
        nome: upv.nome,
        totalOrdens,
        ordensAbertas,
        custoEstimadoTotal,
      });
    }

    return resultado;
  }
}

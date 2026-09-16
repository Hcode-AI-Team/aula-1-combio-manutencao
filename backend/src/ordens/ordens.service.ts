import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrdemManutencao, StatusOrdem } from './ordem-manutencao.entity';
import { CreateOrdemDto } from './dto/create-ordem.dto';
import { UpdateOrdemDto } from './dto/update-ordem.dto';
import { Equipamento } from '../equipamentos/equipamento.entity';

@Injectable()
export class OrdensService {
  constructor(
    @InjectRepository(OrdemManutencao)
    private readonly ordemRepository: Repository<OrdemManutencao>,
    @InjectRepository(Equipamento)
    private readonly equipamentoRepository: Repository<Equipamento>,
  ) {}

  findAll(): Promise<OrdemManutencao[]> {
    return this.ordemRepository.find({
      relations: ['equipamento', 'equipamento.upv'],
    });
  }

  async findOne(id: number): Promise<OrdemManutencao> {
    const ordem = await this.ordemRepository.findOne({
      where: { id },
      relations: ['equipamento', 'equipamento.upv'],
    });
    if (!ordem) {
      throw new NotFoundException(`Ordem ${id} não encontrada`);
    }
    return ordem;
  }

  async create(dto: CreateOrdemDto): Promise<OrdemManutencao> {
    const equipamento = await this.equipamentoRepository.findOne({
      where: { id: dto.equipamentoId },
      relations: ['upv'],
    });
    if (!equipamento) {
      throw new NotFoundException(
        `Equipamento ${dto.equipamentoId} não encontrado`,
      );
    }
    const ordem = this.ordemRepository.create({
      numero: dto.numero,
      descricao: dto.descricao,
      tipo: dto.tipo,
      status: 'aberta',
      prioridade: dto.prioridade,
      equipamento,
      criadaEm: new Date(),
      custoEstimado: dto.custoEstimado,
    });
    return this.ordemRepository.save(ordem);
  }

  async update(id: number, dto: UpdateOrdemDto): Promise<OrdemManutencao> {
    const ordem = await this.findOne(id);
    Object.assign(ordem, dto);
    if (dto.status === 'concluida' && !ordem.concluidaEm) {
      ordem.concluidaEm = new Date();
    }
    return this.ordemRepository.save(ordem);
  }

  async updateStatus(
    id: number,
    status: StatusOrdem,
  ): Promise<OrdemManutencao> {
    const ordem = await this.findOne(id);
    ordem.status = status;
    if (status === 'concluida') {
      ordem.concluidaEm = new Date();
    }
    return this.ordemRepository.save(ordem);
  }
}

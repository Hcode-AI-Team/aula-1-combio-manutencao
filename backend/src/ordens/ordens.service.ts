import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrdemManutencao, StatusOrdem } from './ordem-manutencao.entity';
import { CreateOrdemDto } from './dto/create-ordem.dto';
import { UpdateOrdemDto } from './dto/update-ordem.dto';
import { Equipamento } from '../equipamentos/equipamento.entity';
import {
  TransicaoStatusInvalidaError,
  validarTransicao,
} from './domain/transicao-status';

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
    // Valida o status antes de tocar em qualquer campo: transição proibida
    // não pode deixar a ordem parcialmente alterada.
    if (dto.status !== undefined) {
      this.aplicarStatus(ordem, dto.status);
    }
    if (dto.descricao !== undefined) ordem.descricao = dto.descricao;
    if (dto.tipo !== undefined) ordem.tipo = dto.tipo;
    if (dto.prioridade !== undefined) ordem.prioridade = dto.prioridade;
    if (dto.custoEstimado !== undefined) {
      ordem.custoEstimado = dto.custoEstimado;
    }
    return this.ordemRepository.save(ordem);
  }

  async updateStatus(
    id: number,
    status: StatusOrdem,
  ): Promise<OrdemManutencao> {
    const ordem = await this.findOne(id);
    this.aplicarStatus(ordem, status);
    return this.ordemRepository.save(ordem);
  }

  // Caminho único de mudança de status para update() e updateStatus().
  private aplicarStatus(ordem: OrdemManutencao, para: StatusOrdem): void {
    try {
      validarTransicao(ordem.status, para);
    } catch (erro: unknown) {
      if (erro instanceof TransicaoStatusInvalidaError) {
        throw new ConflictException(erro.message);
      }
      throw erro;
    }
    if (ordem.status === para) {
      return;
    }
    ordem.status = para;
    if (para === 'concluida' && !ordem.concluidaEm) {
      ordem.concluidaEm = new Date();
    }
  }
}

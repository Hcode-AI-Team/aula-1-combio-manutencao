import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Equipamento } from './equipamento.entity';
import { CreateEquipamentoDto } from './dto/create-equipamento.dto';
import { Upv } from '../upvs/upv.entity';

@Injectable()
export class EquipamentosService {
  constructor(
    @InjectRepository(Equipamento)
    private readonly equipamentoRepository: Repository<Equipamento>,
    @InjectRepository(Upv)
    private readonly upvRepository: Repository<Upv>,
  ) {}

  findAll(upvId?: number): Promise<Equipamento[]> {
    if (upvId) {
      return this.equipamentoRepository.find({
        where: { upv: { id: upvId } },
        relations: ['upv'],
      });
    }
    return this.equipamentoRepository.find({ relations: ['upv'] });
  }

  async create(dto: CreateEquipamentoDto): Promise<Equipamento> {
    const upv = await this.upvRepository.findOne({ where: { id: dto.upvId } });
    if (!upv) {
      throw new NotFoundException(`UPV ${dto.upvId} não encontrada`);
    }
    const equipamento = this.equipamentoRepository.create({
      tag: dto.tag,
      tipo: dto.tipo,
      upv,
    });
    return this.equipamentoRepository.save(equipamento);
  }
}

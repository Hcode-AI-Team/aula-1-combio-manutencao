import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Upv } from './upv.entity';
import { CreateUpvDto } from './dto/create-upv.dto';

@Injectable()
export class UpvsService {
  constructor(
    @InjectRepository(Upv)
    private readonly upvRepository: Repository<Upv>,
  ) {}

  findAll(): Promise<Upv[]> {
    return this.upvRepository.find();
  }

  async findOne(id: number): Promise<Upv> {
    const upv = await this.upvRepository.findOne({ where: { id } });
    if (!upv) {
      throw new NotFoundException(`UPV ${id} não encontrada`);
    }
    return upv;
  }

  create(dto: CreateUpvDto): Promise<Upv> {
    const upv = this.upvRepository.create(dto);
    return this.upvRepository.save(upv);
  }
}

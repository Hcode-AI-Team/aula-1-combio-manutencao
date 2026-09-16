import { NotFoundException } from '@nestjs/common';
import { EquipamentosService } from './equipamentos.service';
import { Equipamento } from './equipamento.entity';
import { CreateEquipamentoDto } from './dto/create-equipamento.dto';
import { Upv } from '../upvs/upv.entity';

describe('EquipamentosService', () => {
  let service: EquipamentosService;
  let equipamentoRepository: {
    find: jest.Mock;
    create: jest.Mock;
    save: jest.Mock;
  };
  let upvRepository: { findOne: jest.Mock };

  beforeEach(() => {
    equipamentoRepository = {
      find: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };
    upvRepository = { findOne: jest.fn() };
    service = new EquipamentosService(
      equipamentoRepository as any,
      upvRepository as any,
    );
  });

  it('deve filtrar equipamentos por upvId', async () => {
    const lista = [{ id: 1, tag: 'LP-CAL-01' }] as Equipamento[];
    equipamentoRepository.find.mockResolvedValue(lista);

    await expect(service.findAll(3)).resolves.toEqual(lista);
    expect(equipamentoRepository.find).toHaveBeenCalledWith({
      where: { upv: { id: 3 } },
      relations: ['upv'],
    });
  });

  it('deve lançar NotFoundException ao criar equipamento sem UPV', async () => {
    upvRepository.findOne.mockResolvedValue(null);
    const dto: CreateEquipamentoDto = {
      tag: 'XX-CAL-01',
      tipo: 'caldeira',
      upvId: 99,
    };

    await expect(service.create(dto)).rejects.toBeInstanceOf(NotFoundException);
  });

  it('deve criar equipamento vinculado à UPV', async () => {
    const upv = { id: 1, nome: 'UPV Teste' } as Upv;
    const dto: CreateEquipamentoDto = {
      tag: 'LP-CAL-01',
      tipo: 'caldeira',
      upvId: 1,
    };
    const created = {
      id: 10,
      tag: dto.tag,
      tipo: dto.tipo,
      upv,
    } as Equipamento;
    upvRepository.findOne.mockResolvedValue(upv);
    equipamentoRepository.create.mockReturnValue(created);
    equipamentoRepository.save.mockResolvedValue(created);

    await expect(service.create(dto)).resolves.toEqual(created);
  });
});

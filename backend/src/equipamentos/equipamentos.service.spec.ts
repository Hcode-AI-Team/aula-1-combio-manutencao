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

  it('deve listar todos os equipamentos quando não há filtro', async () => {
    const lista = [{ id: 1 }, { id: 2 }] as Equipamento[];
    equipamentoRepository.find.mockResolvedValue(lista);

    await expect(service.findAll()).resolves.toEqual(lista);
    expect(equipamentoRepository.find).toHaveBeenCalledWith({
      relations: ['upv'],
    });
  });

  // upvId igual a 0 é falsy e cai no ramo sem filtro, mesmo sendo um número.
  it('deve ignorar o filtro quando o upvId é 0', async () => {
    equipamentoRepository.find.mockResolvedValue([]);

    await service.findAll(0);

    expect(equipamentoRepository.find).toHaveBeenCalledWith({
      relations: ['upv'],
    });
  });

  it('deve vincular a UPV encontrada ao equipamento criado', async () => {
    const upv = { id: 3, nome: 'UPV Teste' } as Upv;
    upvRepository.findOne.mockResolvedValue(upv);
    equipamentoRepository.create.mockImplementation(
      (dados: Partial<Equipamento>) => dados as Equipamento,
    );
    equipamentoRepository.save.mockImplementation(async (e: Equipamento) => e);

    await service.create({ tag: 'LP-TUR-02', tipo: 'turbina', upvId: 3 });

    expect(equipamentoRepository.create).toHaveBeenCalledWith({
      tag: 'LP-TUR-02',
      tipo: 'turbina',
      upv,
    });
  });
});

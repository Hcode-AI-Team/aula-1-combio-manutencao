import { NotFoundException } from '@nestjs/common';
import { EquipamentosController } from './equipamentos.controller';
import { Equipamento } from './equipamento.entity';
import { CreateEquipamentoDto } from './dto/create-equipamento.dto';

describe('EquipamentosController', () => {
  let controller: EquipamentosController;
  let service: { findAll: jest.Mock; create: jest.Mock };

  beforeEach(() => {
    service = { findAll: jest.fn(), create: jest.fn() };
    controller = new EquipamentosController(service as any);
  });

  it('deve listar sem filtro quando upvId não é informado', async () => {
    const lista = [{ id: 1, tag: 'LP-CAL-01' }] as Equipamento[];
    service.findAll.mockResolvedValue(lista);

    await expect(controller.findAll()).resolves.toEqual(lista);
    expect(service.findAll).toHaveBeenCalledWith(undefined);
  });

  it('deve converter o upvId da query para número', async () => {
    service.findAll.mockResolvedValue([]);

    await controller.findAll('3');

    expect(service.findAll).toHaveBeenCalledWith(3);
  });

  it('deve tratar query string vazia como ausência de filtro', async () => {
    service.findAll.mockResolvedValue([]);

    await controller.findAll('');

    expect(service.findAll).toHaveBeenCalledWith(undefined);
  });

  // Comportamento atual: um upvId não numérico vira NaN e o service ignora o
  // filtro, devolvendo a lista completa em vez de recusar a requisição.
  it('deve repassar NaN quando o upvId não é numérico', async () => {
    service.findAll.mockResolvedValue([]);

    await controller.findAll('abc');

    expect(service.findAll).toHaveBeenCalledWith(NaN);
  });

  it('deve repassar o dto na criação', async () => {
    const dto: CreateEquipamentoDto = {
      tag: 'LP-CAL-01',
      tipo: 'caldeira',
      upvId: 1,
    };
    const created = { id: 10, tag: dto.tag, tipo: dto.tipo } as Equipamento;
    service.create.mockResolvedValue(created);

    await expect(controller.create(dto)).resolves.toEqual(created);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('deve propagar NotFoundException quando a UPV não existe', async () => {
    service.create.mockRejectedValue(new NotFoundException());

    await expect(
      controller.create({ tag: 'X', tipo: 'bomba', upvId: 99 }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});

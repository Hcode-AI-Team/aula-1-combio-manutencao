import { NotFoundException } from '@nestjs/common';
import { UpvsController } from './upvs.controller';
import { Upv } from './upv.entity';
import { CreateUpvDto } from './dto/create-upv.dto';

describe('UpvsController', () => {
  let controller: UpvsController;
  let service: {
    findAll: jest.Mock;
    findOne: jest.Mock;
    create: jest.Mock;
  };

  beforeEach(() => {
    service = {
      findAll: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
    };
    controller = new UpvsController(service as any);
  });

  it('deve delegar a listagem ao service', async () => {
    const upvs = [{ id: 1, nome: 'UPV Teste' }] as Upv[];
    service.findAll.mockResolvedValue(upvs);

    await expect(controller.findAll()).resolves.toEqual(upvs);
    expect(service.findAll).toHaveBeenCalledTimes(1);
  });

  it('deve repassar o id na busca por uma UPV', async () => {
    const upv = { id: 7, nome: 'UPV Teste' } as Upv;
    service.findOne.mockResolvedValue(upv);

    await expect(controller.findOne(7)).resolves.toEqual(upv);
    expect(service.findOne).toHaveBeenCalledWith(7);
  });

  it('deve propagar NotFoundException vinda do service', async () => {
    service.findOne.mockRejectedValue(new NotFoundException());

    await expect(controller.findOne(99)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('deve repassar o dto na criação', async () => {
    const dto: CreateUpvDto = {
      nome: 'UPV Nova',
      cidade: 'Piracicaba',
      estado: 'SP',
      capacidadeMw: 12,
    };
    const created = { id: 1, ...dto } as Upv;
    service.create.mockResolvedValue(created);

    await expect(controller.create(dto)).resolves.toEqual(created);
    expect(service.create).toHaveBeenCalledWith(dto);
  });
});

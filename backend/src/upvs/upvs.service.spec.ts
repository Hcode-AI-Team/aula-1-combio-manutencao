import { NotFoundException } from '@nestjs/common';
import { UpvsService } from './upvs.service';
import { Upv } from './upv.entity';
import { CreateUpvDto } from './dto/create-upv.dto';

describe('UpvsService', () => {
  let service: UpvsService;
  let upvRepository: {
    find: jest.Mock;
    findOne: jest.Mock;
    create: jest.Mock;
    save: jest.Mock;
  };

  beforeEach(() => {
    upvRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };
    service = new UpvsService(upvRepository as any);
  });

  it('deve listar todas as UPVs', async () => {
    const upvs = [{ id: 1, nome: 'UPV Teste' }] as Upv[];
    upvRepository.find.mockResolvedValue(upvs);

    await expect(service.findAll()).resolves.toEqual(upvs);
    expect(upvRepository.find).toHaveBeenCalled();
  });

  it('deve lançar NotFoundException quando a UPV não existe', async () => {
    upvRepository.findOne.mockResolvedValue(null);

    await expect(service.findOne(99)).rejects.toBeInstanceOf(NotFoundException);
  });

  it('deve criar uma UPV', async () => {
    const dto: CreateUpvDto = {
      nome: 'UPV Nova',
      cidade: 'Piracicaba',
      estado: 'SP',
      capacidadeMw: 12,
    };
    const created = { id: 1, ...dto } as Upv;
    upvRepository.create.mockReturnValue(created);
    upvRepository.save.mockResolvedValue(created);

    await expect(service.create(dto)).resolves.toEqual(created);
  });
});

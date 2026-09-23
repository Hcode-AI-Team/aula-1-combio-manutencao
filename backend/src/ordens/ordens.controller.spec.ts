import { NotFoundException } from '@nestjs/common';
import { OrdensController } from './ordens.controller';
import { OrdemManutencao } from './ordem-manutencao.entity';
import { CreateOrdemDto } from './dto/create-ordem.dto';
import { UpdateOrdemDto } from './dto/update-ordem.dto';

describe('OrdensController', () => {
  let controller: OrdensController;
  let service: {
    findAll: jest.Mock;
    findOne: jest.Mock;
    create: jest.Mock;
    update: jest.Mock;
    updateStatus: jest.Mock;
  };

  beforeEach(() => {
    service = {
      findAll: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      updateStatus: jest.fn(),
    };
    controller = new OrdensController(service as any);
  });

  it('deve delegar a listagem ao service', async () => {
    const ordens = [{ id: 1, numero: 'OM-00001' }] as OrdemManutencao[];
    service.findAll.mockResolvedValue(ordens);

    await expect(controller.findAll()).resolves.toEqual(ordens);
    expect(service.findAll).toHaveBeenCalledTimes(1);
  });

  it('deve repassar o id na busca por uma ordem', async () => {
    const ordem = { id: 4 } as OrdemManutencao;
    service.findOne.mockResolvedValue(ordem);

    await expect(controller.findOne(4)).resolves.toEqual(ordem);
    expect(service.findOne).toHaveBeenCalledWith(4);
  });

  it('deve propagar NotFoundException vinda do service', async () => {
    service.findOne.mockRejectedValue(new NotFoundException());

    await expect(controller.findOne(123)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('deve repassar o dto na criação', async () => {
    const dto: CreateOrdemDto = {
      numero: 'OM-00099',
      descricao: 'Troca de rolamento',
      tipo: 'corretiva',
      prioridade: 2,
      equipamentoId: 2,
      custoEstimado: 4500,
    };
    const created = { id: 7, ...dto } as unknown as OrdemManutencao;
    service.create.mockResolvedValue(created);

    await expect(controller.create(dto)).resolves.toEqual(created);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('deve repassar id e dto na atualização', async () => {
    const dto: UpdateOrdemDto = { descricao: 'Nova descrição' };
    const atualizada = {
      id: 5,
      descricao: 'Nova descrição',
    } as OrdemManutencao;
    service.update.mockResolvedValue(atualizada);

    await expect(controller.update(5, dto)).resolves.toEqual(atualizada);
    expect(service.update).toHaveBeenCalledWith(5, dto);
  });

  it('deve extrair o status do dto ao atualizar apenas o status', async () => {
    const atualizada = { id: 5, status: 'concluida' } as OrdemManutencao;
    service.updateStatus.mockResolvedValue(atualizada);

    await expect(
      controller.updateStatus(5, { status: 'concluida' }),
    ).resolves.toEqual(atualizada);
    expect(service.updateStatus).toHaveBeenCalledWith(5, 'concluida');
  });
});

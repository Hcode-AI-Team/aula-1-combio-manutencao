import { NotFoundException } from '@nestjs/common';
import { OrdensService } from './ordens.service';
import { OrdemManutencao } from './ordem-manutencao.entity';
import { Equipamento } from '../equipamentos/equipamento.entity';
import { CreateOrdemDto } from './dto/create-ordem.dto';

describe('OrdensService', () => {
  let service: OrdensService;
  let ordemRepository: {
    find: jest.Mock;
    findOne: jest.Mock;
    create: jest.Mock;
    save: jest.Mock;
  };
  let equipamentoRepository: { findOne: jest.Mock };

  beforeEach(() => {
    ordemRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };
    equipamentoRepository = { findOne: jest.fn() };
    service = new OrdensService(
      ordemRepository as any,
      equipamentoRepository as any,
    );
  });

  it('deve listar todas as ordens', async () => {
    const ordens = [{ id: 1, numero: 'OM-00001' }] as OrdemManutencao[];
    ordemRepository.find.mockResolvedValue(ordens);

    await expect(service.findAll()).resolves.toEqual(ordens);
    expect(ordemRepository.find).toHaveBeenCalled();
  });

  it('deve criar ordem com status aberta', async () => {
    const equipamento = { id: 2, tag: 'LP-CAL-01' } as Equipamento;
    const dto: CreateOrdemDto = {
      numero: 'OM-00099',
      descricao: 'Troca de rolamento',
      tipo: 'corretiva',
      prioridade: 2,
      equipamentoId: 2,
      custoEstimado: 4500,
    };
    const created = {
      id: 7,
      ...dto,
      status: 'aberta',
      equipamento,
    } as unknown as OrdemManutencao;

    equipamentoRepository.findOne.mockResolvedValue(equipamento);
    ordemRepository.create.mockReturnValue(created);
    ordemRepository.save.mockResolvedValue(created);

    const result = await service.create(dto);
    expect(result.status).toBe('aberta');
    expect(ordemRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'aberta', equipamento }),
    );
  });

  it('deve lançar NotFoundException quando a ordem não existe', async () => {
    ordemRepository.findOne.mockResolvedValue(null);

    await expect(service.findOne(123)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});

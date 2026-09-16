import { RelatoriosService } from './relatorios.service';
import { Upv } from '../upvs/upv.entity';
import { Equipamento } from '../equipamentos/equipamento.entity';
import { OrdemManutencao } from '../ordens/ordem-manutencao.entity';

describe('RelatoriosService', () => {
  let service: RelatoriosService;
  let upvRepository: { find: jest.Mock };
  let equipamentoRepository: { find: jest.Mock };
  let ordemRepository: { find: jest.Mock };

  beforeEach(() => {
    upvRepository = { find: jest.fn() };
    equipamentoRepository = { find: jest.fn() };
    ordemRepository = { find: jest.fn() };
    service = new RelatoriosService(
      upvRepository as any,
      equipamentoRepository as any,
      ordemRepository as any,
    );
  });

  it('agrega total, abertas e custo por UPV', async () => {
    const upv = { id: 1, nome: 'UPV Teste' } as Upv;
    const equipamento = { id: 10 } as Equipamento;
    const ordens = [
      { status: 'aberta', custoEstimado: 1000 },
      { status: 'concluida', custoEstimado: 2500 },
    ] as OrdemManutencao[];

    upvRepository.find.mockResolvedValue([upv]);
    equipamentoRepository.find.mockResolvedValue([equipamento]);
    ordemRepository.find.mockResolvedValue(ordens);

    const resultado = await service.ordensPorUpv();

    expect(resultado).toEqual([
      {
        nome: 'UPV Teste',
        totalOrdens: 2,
        ordensAbertas: 1,
        custoEstimadoTotal: 3500,
      },
    ]);
    expect(equipamentoRepository.find).toHaveBeenCalledWith({
      where: { upv: { id: 1 } },
    });
    expect(ordemRepository.find).toHaveBeenCalledWith({
      where: { equipamento: { id: 10 } },
    });
  });

  it('devolve lista vazia quando não há UPVs', async () => {
    upvRepository.find.mockResolvedValue([]);

    await expect(service.ordensPorUpv()).resolves.toEqual([]);
    expect(equipamentoRepository.find).not.toHaveBeenCalled();
  });

  it('zera os totais de UPV sem equipamentos', async () => {
    upvRepository.find.mockResolvedValue([{ id: 1, nome: 'UPV Vazia' } as Upv]);
    equipamentoRepository.find.mockResolvedValue([]);

    await expect(service.ordensPorUpv()).resolves.toEqual([
      {
        nome: 'UPV Vazia',
        totalOrdens: 0,
        ordensAbertas: 0,
        custoEstimadoTotal: 0,
      },
    ]);
    expect(ordemRepository.find).not.toHaveBeenCalled();
  });

  it('zera os totais de equipamento sem ordens', async () => {
    upvRepository.find.mockResolvedValue([{ id: 1, nome: 'UPV Teste' } as Upv]);
    equipamentoRepository.find.mockResolvedValue([{ id: 10 } as Equipamento]);
    ordemRepository.find.mockResolvedValue([]);

    await expect(service.ordensPorUpv()).resolves.toEqual([
      {
        nome: 'UPV Teste',
        totalOrdens: 0,
        ordensAbertas: 0,
        custoEstimadoTotal: 0,
      },
    ]);
  });

  it('soma as ordens de todos os equipamentos da UPV', async () => {
    upvRepository.find.mockResolvedValue([{ id: 1, nome: 'UPV Teste' } as Upv]);
    equipamentoRepository.find.mockResolvedValue([
      { id: 10 },
      { id: 11 },
    ] as Equipamento[]);
    ordemRepository.find
      .mockResolvedValueOnce([
        { status: 'aberta', custoEstimado: 1000 },
      ] as OrdemManutencao[])
      .mockResolvedValueOnce([
        { status: 'aberta', custoEstimado: 500 },
        { status: 'cancelada', custoEstimado: 250 },
      ] as OrdemManutencao[]);

    await expect(service.ordensPorUpv()).resolves.toEqual([
      {
        nome: 'UPV Teste',
        totalOrdens: 3,
        ordensAbertas: 2,
        custoEstimadoTotal: 1750,
      },
    ]);
  });

  it('produz uma linha por UPV', async () => {
    upvRepository.find.mockResolvedValue([
      { id: 1, nome: 'UPV A' },
      { id: 2, nome: 'UPV B' },
    ] as Upv[]);
    equipamentoRepository.find.mockResolvedValue([]);

    const resultado = await service.ordensPorUpv();

    expect(resultado.map((linha) => linha.nome)).toEqual(['UPV A', 'UPV B']);
  });
});

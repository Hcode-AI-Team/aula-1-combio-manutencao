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
});

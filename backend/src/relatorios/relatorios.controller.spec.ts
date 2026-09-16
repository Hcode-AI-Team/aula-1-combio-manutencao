import { RelatoriosController } from './relatorios.controller';
import { RelatorioOrdensPorUpv } from './relatorios.service';

describe('RelatoriosController', () => {
  let controller: RelatoriosController;
  let service: { ordensPorUpv: jest.Mock };

  beforeEach(() => {
    service = { ordensPorUpv: jest.fn() };
    controller = new RelatoriosController(service as any);
  });

  it('deve delegar o relatório ao service', async () => {
    const relatorio: RelatorioOrdensPorUpv[] = [
      {
        nome: 'UPV Teste',
        totalOrdens: 2,
        ordensAbertas: 1,
        custoEstimadoTotal: 3500,
      },
    ];
    service.ordensPorUpv.mockResolvedValue(relatorio);

    await expect(controller.ordensPorUpv()).resolves.toEqual(relatorio);
    expect(service.ordensPorUpv).toHaveBeenCalledTimes(1);
  });

  it('deve devolver lista vazia quando não há UPVs', async () => {
    service.ordensPorUpv.mockResolvedValue([]);

    await expect(controller.ordensPorUpv()).resolves.toEqual([]);
  });
});

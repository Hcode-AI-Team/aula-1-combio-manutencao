import { ConflictException, NotFoundException } from '@nestjs/common';
import { OrdensService } from './ordens.service';
import * as transicaoStatus from './domain/transicao-status';
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

  it('deve carregar equipamento e UPV ao listar', async () => {
    ordemRepository.find.mockResolvedValue([]);

    await service.findAll();

    expect(ordemRepository.find).toHaveBeenCalledWith({
      relations: ['equipamento', 'equipamento.upv'],
    });
  });

  it('deve carregar equipamento e UPV ao buscar uma ordem', async () => {
    const ordem = { id: 4 } as OrdemManutencao;
    ordemRepository.findOne.mockResolvedValue(ordem);

    await expect(service.findOne(4)).resolves.toEqual(ordem);
    expect(ordemRepository.findOne).toHaveBeenCalledWith({
      where: { id: 4 },
      relations: ['equipamento', 'equipamento.upv'],
    });
  });

  it('deve lançar NotFoundException ao criar ordem para equipamento inexistente', async () => {
    equipamentoRepository.findOne.mockResolvedValue(null);

    await expect(
      service.create({
        numero: 'OM-00100',
        descricao: 'Sem equipamento',
        tipo: 'preventiva',
        prioridade: 1,
        equipamentoId: 404,
        custoEstimado: 100,
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
    expect(ordemRepository.save).not.toHaveBeenCalled();
  });

  describe('update', () => {
    it('deve aplicar os campos recebidos', async () => {
      const ordem = {
        id: 5,
        descricao: 'Antiga',
        status: 'aberta',
      } as OrdemManutencao;
      ordemRepository.findOne.mockResolvedValue(ordem);
      ordemRepository.save.mockImplementation(async (o: OrdemManutencao) => o);

      const result = await service.update(5, { descricao: 'Nova' });

      expect(result.descricao).toBe('Nova');
      expect(result.status).toBe('aberta');
    });

    it('deve registrar a data de conclusão ao concluir', async () => {
      const ordem = { id: 5, status: 'aberta' } as OrdemManutencao;
      ordemRepository.findOne.mockResolvedValue(ordem);
      ordemRepository.save.mockImplementation(async (o: OrdemManutencao) => o);

      const result = await service.update(5, { status: 'concluida' });

      expect(result.concluidaEm).toBeInstanceOf(Date);
    });

    it('deve preservar a data de conclusão já existente', async () => {
      const concluidaEm = new Date('2026-01-10T12:00:00Z');
      const ordem = {
        id: 5,
        status: 'concluida',
        concluidaEm,
      } as OrdemManutencao;
      ordemRepository.findOne.mockResolvedValue(ordem);
      ordemRepository.save.mockImplementation(async (o: OrdemManutencao) => o);

      const result = await service.update(5, { status: 'concluida' });

      expect(result.concluidaEm).toBe(concluidaEm);
    });

    it('não deve registrar data de conclusão para outros status', async () => {
      const ordem = { id: 5, status: 'aberta' } as OrdemManutencao;
      ordemRepository.findOne.mockResolvedValue(ordem);
      ordemRepository.save.mockImplementation(async (o: OrdemManutencao) => o);

      const result = await service.update(5, { status: 'cancelada' });

      expect(result.concluidaEm).toBeUndefined();
    });

    it('deve propagar NotFoundException quando a ordem não existe', async () => {
      ordemRepository.findOne.mockResolvedValue(null);

      await expect(
        service.update(123, { descricao: 'x' }),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it('deve aplicar tipo, prioridade e custo estimado', async () => {
      const ordem = {
        id: 5,
        status: 'aberta',
        tipo: 'preventiva',
        prioridade: 1,
        custoEstimado: 100,
      } as OrdemManutencao;
      ordemRepository.findOne.mockResolvedValue(ordem);
      ordemRepository.save.mockImplementation(async (o: OrdemManutencao) => o);

      const result = await service.update(5, {
        tipo: 'corretiva',
        prioridade: 3,
        custoEstimado: 0,
      });

      expect(result.tipo).toBe('corretiva');
      expect(result.prioridade).toBe(3);
      expect(result.custoEstimado).toBe(0);
    });

    it('deve permitir editar campos de ordem finalizada sem mudar o status', async () => {
      const ordem = {
        id: 5,
        status: 'concluida',
        descricao: 'Antiga',
      } as OrdemManutencao;
      ordemRepository.findOne.mockResolvedValue(ordem);
      ordemRepository.save.mockImplementation(async (o: OrdemManutencao) => o);

      const result = await service.update(5, { descricao: 'Nova' });

      expect(result.descricao).toBe('Nova');
      expect(result.status).toBe('concluida');
    });

    it('deve responder 409 na transição proibida sem alterar nenhum campo', async () => {
      const ordem = {
        id: 5,
        status: 'cancelada',
        descricao: 'Original',
      } as OrdemManutencao;
      ordemRepository.findOne.mockResolvedValue(ordem);

      const promessa = service.update(5, {
        status: 'aberta',
        descricao: 'Tentativa',
      });

      await expect(promessa).rejects.toBeInstanceOf(ConflictException);
      await expect(promessa).rejects.toThrow(
        'Transição de status inválida: cancelada → aberta',
      );
      expect(ordem.status).toBe('cancelada');
      expect(ordem.descricao).toBe('Original');
      expect(ordemRepository.save).not.toHaveBeenCalled();
    });

    it('deve permitir voltar de em_execucao para aberta', async () => {
      const ordem = { id: 5, status: 'em_execucao' } as OrdemManutencao;
      ordemRepository.findOne.mockResolvedValue(ordem);
      ordemRepository.save.mockImplementation(async (o: OrdemManutencao) => o);

      const result = await service.update(5, { status: 'aberta' });

      expect(result.status).toBe('aberta');
      expect(result.concluidaEm).toBeUndefined();
    });
  });

  describe('updateStatus', () => {
    it('deve trocar o status', async () => {
      const ordem = { id: 5, status: 'aberta' } as OrdemManutencao;
      ordemRepository.findOne.mockResolvedValue(ordem);
      ordemRepository.save.mockImplementation(async (o: OrdemManutencao) => o);

      const result = await service.updateStatus(5, 'em_execucao');

      expect(result.status).toBe('em_execucao');
      expect(result.concluidaEm).toBeUndefined();
    });

    it('deve registrar a data de conclusão ao concluir', async () => {
      const ordem = { id: 5, status: 'em_execucao' } as OrdemManutencao;
      ordemRepository.findOne.mockResolvedValue(ordem);
      ordemRepository.save.mockImplementation(async (o: OrdemManutencao) => o);

      const result = await service.updateStatus(5, 'concluida');

      expect(result.concluidaEm).toBeInstanceOf(Date);
    });

    // D1: a antiga assimetria (updateStatus sobrescrevia concluidaEm) foi
    // eliminada. Agora os dois métodos preservam a data da primeira conclusão.
    it('deve preservar a data de conclusão já existente (idempotente)', async () => {
      const concluidaEm = new Date('2026-01-10T12:00:00Z');
      const ordem = {
        id: 5,
        status: 'concluida',
        concluidaEm,
      } as OrdemManutencao;
      ordemRepository.findOne.mockResolvedValue(ordem);
      ordemRepository.save.mockImplementation(async (o: OrdemManutencao) => o);

      const result = await service.updateStatus(5, 'concluida');

      expect(result.concluidaEm).toBe(concluidaEm);
    });

    it('deve preencher concluidaEm só se ainda estiver vazia', async () => {
      const concluidaEm = new Date('2026-01-10T12:00:00Z');
      const ordem = {
        id: 5,
        status: 'em_execucao',
        concluidaEm,
      } as OrdemManutencao;
      ordemRepository.findOne.mockResolvedValue(ordem);
      ordemRepository.save.mockImplementation(async (o: OrdemManutencao) => o);

      const result = await service.updateStatus(5, 'concluida');

      expect(result.status).toBe('concluida');
      expect(result.concluidaEm).toBe(concluidaEm);
    });

    it.each([
      ['concluida', 'aberta'],
      ['concluida', 'em_execucao'],
      ['concluida', 'cancelada'],
      ['cancelada', 'aberta'],
      ['cancelada', 'em_execucao'],
      ['cancelada', 'concluida'],
    ] as const)(
      'deve responder 409 na transição proibida %s → %s',
      async (de, para) => {
        const ordem = { id: 5, status: de } as OrdemManutencao;
        ordemRepository.findOne.mockResolvedValue(ordem);

        const promessa = service.updateStatus(5, para);

        await expect(promessa).rejects.toBeInstanceOf(ConflictException);
        await expect(promessa).rejects.toThrow(
          `Transição de status inválida: ${de} → ${para}`,
        );
        expect(ordem.status).toBe(de);
        expect(ordemRepository.save).not.toHaveBeenCalled();
      },
    );

    it('deve repassar erros inesperados da validação sem convertê-los em 409', async () => {
      const ordem = { id: 5, status: 'aberta' } as OrdemManutencao;
      ordemRepository.findOne.mockResolvedValue(ordem);
      const falha = new Error('falha inesperada');
      const espiao = jest
        .spyOn(transicaoStatus, 'validarTransicao')
        .mockImplementation(() => {
          throw falha;
        });

      await expect(service.updateStatus(5, 'cancelada')).rejects.toBe(falha);
      espiao.mockRestore();
    });

    it('deve propagar NotFoundException quando a ordem não existe', async () => {
      ordemRepository.findOne.mockResolvedValue(null);

      await expect(
        service.updateStatus(123, 'cancelada'),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });
});

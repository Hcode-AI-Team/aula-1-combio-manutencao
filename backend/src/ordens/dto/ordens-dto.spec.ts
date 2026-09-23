import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateOrdemDto } from './create-ordem.dto';
import { UpdateOrdemDto } from './update-ordem.dto';
import { UpdateStatusDto } from './update-status.dto';

// Reproduz o ValidationPipe configurado em main.ts e devolve apenas os nomes
// das propriedades que falharam, o que torna as asserções legíveis.
async function propriedadesInvalidas<T extends object>(
  cls: new () => T,
  payload: object,
): Promise<string[]> {
  const instancia = plainToInstance(cls, payload, {
    enableImplicitConversion: true,
  });
  const erros = await validate(instancia as object, { whitelist: true });
  return erros.map((erro) => erro.property).sort();
}

const ordemValida = {
  numero: 'OM-00099',
  descricao: 'Troca de rolamento',
  tipo: 'corretiva',
  prioridade: 2,
  equipamentoId: 2,
  custoEstimado: 4500,
};

describe('CreateOrdemDto', () => {
  it('aceita um payload válido', async () => {
    await expect(
      propriedadesInvalidas(CreateOrdemDto, ordemValida),
    ).resolves.toEqual([]);
  });

  it('recusa tipo fora do enum', async () => {
    await expect(
      propriedadesInvalidas(CreateOrdemDto, {
        ...ordemValida,
        tipo: 'inexistente',
      }),
    ).resolves.toEqual(['tipo']);
  });

  it.each([0, 4])('recusa prioridade %i, fora da faixa 1 a 3', async (v) => {
    await expect(
      propriedadesInvalidas(CreateOrdemDto, {
        ...ordemValida,
        prioridade: v,
      }),
    ).resolves.toEqual(['prioridade']);
  });

  it('recusa prioridade fracionária', async () => {
    await expect(
      propriedadesInvalidas(CreateOrdemDto, {
        ...ordemValida,
        prioridade: 2.5,
      }),
    ).resolves.toEqual(['prioridade']);
  });

  it('recusa custo estimado negativo', async () => {
    await expect(
      propriedadesInvalidas(CreateOrdemDto, {
        ...ordemValida,
        custoEstimado: -1,
      }),
    ).resolves.toEqual(['custoEstimado']);
  });

  it('aceita custo estimado zero', async () => {
    await expect(
      propriedadesInvalidas(CreateOrdemDto, {
        ...ordemValida,
        custoEstimado: 0,
      }),
    ).resolves.toEqual([]);
  });

  it('acusa todos os campos obrigatórios quando o payload é vazio', async () => {
    await expect(propriedadesInvalidas(CreateOrdemDto, {})).resolves.toEqual([
      'custoEstimado',
      'descricao',
      'equipamentoId',
      'numero',
      'prioridade',
      'tipo',
    ]);
  });
});

describe('UpdateOrdemDto', () => {
  it('aceita payload vazio, já que todos os campos são opcionais', async () => {
    await expect(propriedadesInvalidas(UpdateOrdemDto, {})).resolves.toEqual(
      [],
    );
  });

  it('aceita atualização parcial', async () => {
    await expect(
      propriedadesInvalidas(UpdateOrdemDto, { descricao: 'Nova descrição' }),
    ).resolves.toEqual([]);
  });

  it('recusa status fora do enum', async () => {
    await expect(
      propriedadesInvalidas(UpdateOrdemDto, { status: 'pausada' }),
    ).resolves.toEqual(['status']);
  });

  it('recusa prioridade fora da faixa mesmo sendo opcional', async () => {
    await expect(
      propriedadesInvalidas(UpdateOrdemDto, { prioridade: 9 }),
    ).resolves.toEqual(['prioridade']);
  });
});

describe('UpdateStatusDto', () => {
  it.each(['aberta', 'em_execucao', 'concluida', 'cancelada'])(
    'aceita o status %s',
    async (status) => {
      await expect(
        propriedadesInvalidas(UpdateStatusDto, { status }),
      ).resolves.toEqual([]);
    },
  );

  it('recusa status desconhecido', async () => {
    await expect(
      propriedadesInvalidas(UpdateStatusDto, { status: 'arquivada' }),
    ).resolves.toEqual(['status']);
  });

  it('exige o status', async () => {
    await expect(propriedadesInvalidas(UpdateStatusDto, {})).resolves.toEqual([
      'status',
    ]);
  });
});

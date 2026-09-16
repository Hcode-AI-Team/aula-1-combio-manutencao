import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateEquipamentoDto } from './create-equipamento.dto';

async function propriedadesInvalidas(payload: object): Promise<string[]> {
  const instancia = plainToInstance(CreateEquipamentoDto, payload, {
    enableImplicitConversion: true,
  });
  const erros = await validate(instancia, { whitelist: true });
  return erros.map((erro) => erro.property).sort();
}

const equipamentoValido = {
  tag: 'LP-CAL-01',
  tipo: 'caldeira',
  upvId: 1,
};

describe('CreateEquipamentoDto', () => {
  it('aceita um payload válido', async () => {
    await expect(propriedadesInvalidas(equipamentoValido)).resolves.toEqual([]);
  });

  it.each(['caldeira', 'turbina', 'esteira', 'gerador', 'bomba'])(
    'aceita o tipo %s',
    async (tipo) => {
      await expect(
        propriedadesInvalidas({ ...equipamentoValido, tipo }),
      ).resolves.toEqual([]);
    },
  );

  it('recusa tipo fora do enum', async () => {
    await expect(
      propriedadesInvalidas({ ...equipamentoValido, tipo: 'moinho' }),
    ).resolves.toEqual(['tipo']);
  });

  it('recusa upvId fracionário', async () => {
    await expect(
      propriedadesInvalidas({ ...equipamentoValido, upvId: 1.5 }),
    ).resolves.toEqual(['upvId']);
  });

  it('acusa todos os campos obrigatórios quando o payload é vazio', async () => {
    await expect(propriedadesInvalidas({})).resolves.toEqual([
      'tag',
      'tipo',
      'upvId',
    ]);
  });
});

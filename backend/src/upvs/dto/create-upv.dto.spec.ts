import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateUpvDto } from './create-upv.dto';

async function propriedadesInvalidas(payload: object): Promise<string[]> {
  const instancia = plainToInstance(CreateUpvDto, payload, {
    enableImplicitConversion: true,
  });
  const erros = await validate(instancia, { whitelist: true });
  return erros.map((erro) => erro.property).sort();
}

const upvValida = {
  nome: 'UPV Nova',
  cidade: 'Piracicaba',
  estado: 'SP',
  capacidadeMw: 12,
};

describe('CreateUpvDto', () => {
  it('aceita um payload válido', async () => {
    await expect(propriedadesInvalidas(upvValida)).resolves.toEqual([]);
  });

  it('recusa capacidade negativa', async () => {
    await expect(
      propriedadesInvalidas({ ...upvValida, capacidadeMw: -5 }),
    ).resolves.toEqual(['capacidadeMw']);
  });

  it('aceita capacidade zero', async () => {
    await expect(
      propriedadesInvalidas({ ...upvValida, capacidadeMw: 0 }),
    ).resolves.toEqual([]);
  });

  it('recusa capacidade não numérica', async () => {
    await expect(
      propriedadesInvalidas({ ...upvValida, capacidadeMw: 'muita' }),
    ).resolves.toEqual(['capacidadeMw']);
  });

  it('acusa todos os campos obrigatórios quando o payload é vazio', async () => {
    await expect(propriedadesInvalidas({})).resolves.toEqual([
      'capacidadeMw',
      'cidade',
      'estado',
      'nome',
    ]);
  });
});

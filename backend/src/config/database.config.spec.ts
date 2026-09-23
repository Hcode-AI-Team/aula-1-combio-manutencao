import { getDatabaseConfig } from './database.config';
import { Upv } from '../upvs/upv.entity';
import { Equipamento } from '../equipamentos/equipamento.entity';
import { OrdemManutencao } from '../ordens/ordem-manutencao.entity';

describe('getDatabaseConfig', () => {
  const sqlitePathOriginal = process.env.SQLITE_PATH;

  afterEach(() => {
    if (sqlitePathOriginal === undefined) {
      delete process.env.SQLITE_PATH;
    } else {
      process.env.SQLITE_PATH = sqlitePathOriginal;
    }
  });

  it('usa o driver better-sqlite3', () => {
    expect(getDatabaseConfig()).toMatchObject({ type: 'better-sqlite3' });
  });

  it('usa o caminho definido em SQLITE_PATH', () => {
    process.env.SQLITE_PATH = ':memory:';

    expect(getDatabaseConfig()).toMatchObject({ database: ':memory:' });
  });

  it('cai no arquivo padrão quando SQLITE_PATH não está definido', () => {
    delete process.env.SQLITE_PATH;

    expect(getDatabaseConfig()).toMatchObject({
      database: 'manutencao.sqlite',
    });
  });

  it('registra as três entidades do domínio', () => {
    expect(getDatabaseConfig()).toMatchObject({
      entities: [Upv, Equipamento, OrdemManutencao],
    });
  });

  it('mantém synchronize ligado, como esperado no banco de treinamento', () => {
    expect(getDatabaseConfig()).toMatchObject({ synchronize: true });
  });
});

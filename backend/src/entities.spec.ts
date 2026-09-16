import { DataSource } from 'typeorm';
import { Upv } from './upvs/upv.entity';
import { Equipamento } from './equipamentos/equipamento.entity';
import { OrdemManutencao } from './ordens/ordem-manutencao.entity';

// As relações das entidades só são resolvidas quando o TypeORM constrói os
// metadados, então este bloco sobe um SQLite em memória para validar o
// mapeamento de verdade, em vez de inspecionar os decoradores.
describe('Mapeamento das entidades', () => {
  let dataSource: DataSource;

  beforeAll(async () => {
    dataSource = new DataSource({
      type: 'better-sqlite3',
      database: ':memory:',
      entities: [Upv, Equipamento, OrdemManutencao],
      synchronize: true,
    });
    await dataSource.initialize();
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  it('liga UPV a equipamentos como um-para-muitos', () => {
    const relacao = dataSource
      .getMetadata(Upv)
      .relations.find((r) => r.propertyName === 'equipamentos');

    expect(relacao?.relationType).toBe('one-to-many');
    expect(relacao?.inverseEntityMetadata.target).toBe(Equipamento);
  });

  it('exige UPV em todo equipamento', () => {
    const relacao = dataSource
      .getMetadata(Equipamento)
      .relations.find((r) => r.propertyName === 'upv');

    expect(relacao?.relationType).toBe('many-to-one');
    expect(relacao?.isNullable).toBe(false);
  });

  it('exige equipamento em toda ordem', () => {
    const relacao = dataSource
      .getMetadata(OrdemManutencao)
      .relations.find((r) => r.propertyName === 'equipamento');

    expect(relacao?.relationType).toBe('many-to-one');
    expect(relacao?.isNullable).toBe(false);
  });

  it('permite concluidaEm nula e exige as demais colunas da ordem', () => {
    const colunas = dataSource.getMetadata(OrdemManutencao).columns;
    const porNome = (nome: string) =>
      colunas.find((c) => c.propertyName === nome);

    expect(porNome('concluidaEm')?.isNullable).toBe(true);
    expect(porNome('criadaEm')?.isNullable).toBe(false);
    expect(porNome('numero')?.isNullable).toBe(false);
  });

  it('persiste e recarrega o encadeamento UPV, equipamento e ordem', async () => {
    const upv = await dataSource.getRepository(Upv).save({
      nome: 'UPV Mapeamento',
      cidade: 'Piracicaba',
      estado: 'SP',
      capacidadeMw: 9.5,
    });
    const equipamento = await dataSource.getRepository(Equipamento).save({
      tag: 'MAP-CAL-01',
      tipo: 'caldeira',
      upv,
    });
    const ordem = await dataSource.getRepository(OrdemManutencao).save({
      numero: 'OM-MAP-001',
      descricao: 'Inspeção de mapeamento',
      tipo: 'preventiva',
      status: 'aberta',
      prioridade: 1,
      equipamento,
      criadaEm: new Date(),
      custoEstimado: 1500,
    });

    const recarregada = await dataSource
      .getRepository(OrdemManutencao)
      .findOne({
        where: { id: ordem.id },
        relations: ['equipamento', 'equipamento.upv'],
      });

    expect(recarregada?.equipamento.tag).toBe('MAP-CAL-01');
    expect(recarregada?.equipamento.upv.nome).toBe('UPV Mapeamento');
    expect(recarregada?.concluidaEm).toBeNull();
  });

  it('recusa equipamento sem UPV', async () => {
    await expect(
      dataSource
        .getRepository(Equipamento)
        .save({ tag: 'MAP-SEM-UPV', tipo: 'bomba' }),
    ).rejects.toBeDefined();
  });
});

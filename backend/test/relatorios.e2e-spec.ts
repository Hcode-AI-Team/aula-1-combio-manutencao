import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Relatório de ordens por UPV (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    process.env.SQLITE_PATH = ':memory:';

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('agrega as ordens da UPV', async () => {
    const upv = await request(app.getHttpServer())
      .post('/upvs')
      .send({
        nome: 'UPV Relatório',
        cidade: 'Ubarana',
        estado: 'SP',
        capacidadeMw: 15,
      })
      .expect(201);

    const equipamento = await request(app.getHttpServer())
      .post('/equipamentos')
      .send({ tag: 'REL-GER-01', tipo: 'gerador', upvId: upv.body.id })
      .expect(201);

    const ordem = await request(app.getHttpServer())
      .post('/ordens')
      .send({
        numero: 'OM-REL-001',
        descricao: 'Ordem do relatório',
        tipo: 'corretiva',
        prioridade: 3,
        equipamentoId: equipamento.body.id,
        custoEstimado: 2000,
      })
      .expect(201);

    await request(app.getHttpServer())
      .post('/ordens')
      .send({
        numero: 'OM-REL-002',
        descricao: 'Segunda ordem',
        tipo: 'preventiva',
        prioridade: 1,
        equipamentoId: equipamento.body.id,
        custoEstimado: 500,
      })
      .expect(201);

    await request(app.getHttpServer())
      .patch(`/ordens/${ordem.body.id}/status`)
      .send({ status: 'concluida' })
      .expect(200);

    const res = await request(app.getHttpServer())
      .get('/relatorios/ordens-por-upv')
      .expect(200);

    const linha = res.body.find(
      (l: { nome: string }) => l.nome === 'UPV Relatório',
    );
    expect(linha).toEqual({
      nome: 'UPV Relatório',
      totalOrdens: 2,
      ordensAbertas: 1,
      custoEstimadoTotal: 2500,
    });
  });

  it('inclui UPV sem ordens zerada no relatório', async () => {
    await request(app.getHttpServer())
      .post('/upvs')
      .send({
        nome: 'UPV Sem Ordens',
        cidade: 'Barra Bonita',
        estado: 'SP',
        capacidadeMw: 5,
      })
      .expect(201);

    const res = await request(app.getHttpServer())
      .get('/relatorios/ordens-por-upv')
      .expect(200);

    expect(
      res.body.find((l: { nome: string }) => l.nome === 'UPV Sem Ordens'),
    ).toEqual({
      nome: 'UPV Sem Ordens',
      totalOrdens: 0,
      ordensAbertas: 0,
      custoEstimadoTotal: 0,
    });
  });
});

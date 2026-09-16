import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Ordens (e2e)', () => {
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

  it('cria UPV, equipamento e ordem, depois consulta a ordem', async () => {
    const upvRes = await request(app.getHttpServer())
      .post('/upvs')
      .send({
        nome: 'UPV E2E',
        cidade: 'Piracicaba',
        estado: 'SP',
        capacidadeMw: 10,
      })
      .expect(201);

    const eqRes = await request(app.getHttpServer())
      .post('/equipamentos')
      .send({
        tag: 'E2E-CAL-01',
        tipo: 'caldeira',
        upvId: upvRes.body.id,
      })
      .expect(201);

    const ordemRes = await request(app.getHttpServer())
      .post('/ordens')
      .send({
        numero: 'OM-E2E-001',
        descricao: 'Inspeção e2e',
        tipo: 'preventiva',
        prioridade: 1,
        equipamentoId: eqRes.body.id,
        custoEstimado: 1200,
      })
      .expect(201);

    expect(ordemRes.body.status).toBe('aberta');

    const listRes = await request(app.getHttpServer())
      .get('/ordens')
      .expect(200);
    expect(Array.isArray(listRes.body)).toBe(true);
    expect(listRes.body.length).toBeGreaterThanOrEqual(1);

    await request(app.getHttpServer())
      .get(`/ordens/${ordemRes.body.id}`)
      .expect(200);
  });
});

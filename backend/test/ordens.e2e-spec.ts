import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Ordens (e2e)', () => {
  let app: INestApplication;
  let equipamentoId: number;

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
      .send({ tag: 'E2E-CAL-01', tipo: 'caldeira', upvId: upvRes.body.id })
      .expect(201);

    equipamentoId = eqRes.body.id;
  });

  afterAll(async () => {
    await app.close();
  });

  function novaOrdem(overrides: Record<string, unknown> = {}) {
    return {
      numero: `OM-E2E-${Math.random().toString().slice(2, 8)}`,
      descricao: 'Inspeção e2e',
      tipo: 'preventiva',
      prioridade: 1,
      equipamentoId,
      custoEstimado: 1200,
      ...overrides,
    };
  }

  it('cria uma ordem já no status aberta', async () => {
    const res = await request(app.getHttpServer())
      .post('/ordens')
      .send(novaOrdem())
      .expect(201);

    expect(res.body.status).toBe('aberta');
    expect(res.body.id).toBeDefined();
  });

  it('lista as ordens com o equipamento e a UPV aninhados', async () => {
    await request(app.getHttpServer())
      .post('/ordens')
      .send(novaOrdem())
      .expect(201);

    const res = await request(app.getHttpServer()).get('/ordens').expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
    expect(res.body[0].equipamento.upv.nome).toBe('UPV E2E');
  });

  it('consulta uma ordem pelo id', async () => {
    const criada = await request(app.getHttpServer())
      .post('/ordens')
      .send(novaOrdem({ descricao: 'Para consulta' }))
      .expect(201);

    const res = await request(app.getHttpServer())
      .get(`/ordens/${criada.body.id}`)
      .expect(200);

    expect(res.body.descricao).toBe('Para consulta');
  });

  it('responde 404 para ordem inexistente', async () => {
    await request(app.getHttpServer()).get('/ordens/999999').expect(404);
  });

  it('responde 400 quando o id não é numérico', async () => {
    await request(app.getHttpServer()).get('/ordens/abc').expect(400);
  });

  it('responde 404 ao criar ordem para equipamento inexistente', async () => {
    await request(app.getHttpServer())
      .post('/ordens')
      .send(novaOrdem({ equipamentoId: 999999 }))
      .expect(404);
  });

  it.each([
    ['tipo fora do enum', { tipo: 'inexistente' }],
    ['prioridade acima da faixa', { prioridade: 5 }],
    ['custo estimado negativo', { custoEstimado: -1 }],
    ['descrição ausente', { descricao: undefined }],
  ])('responde 400 quando há %s', async (_caso, overrides) => {
    await request(app.getHttpServer())
      .post('/ordens')
      .send(novaOrdem(overrides))
      .expect(400);
  });

  it('descarta propriedades não declaradas no dto', async () => {
    const res = await request(app.getHttpServer())
      .post('/ordens')
      .send(novaOrdem({ status: 'concluida', campoInventado: 'x' }))
      .expect(201);

    expect(res.body.status).toBe('aberta');
    expect(res.body.campoInventado).toBeUndefined();
  });

  it('atualiza a descrição via PATCH', async () => {
    const criada = await request(app.getHttpServer())
      .post('/ordens')
      .send(novaOrdem())
      .expect(201);

    const res = await request(app.getHttpServer())
      .patch(`/ordens/${criada.body.id}`)
      .send({ descricao: 'Descrição revisada' })
      .expect(200);

    expect(res.body.descricao).toBe('Descrição revisada');
  });

  it('registra a data de conclusão ao mudar o status para concluida', async () => {
    const criada = await request(app.getHttpServer())
      .post('/ordens')
      .send(novaOrdem())
      .expect(201);

    const res = await request(app.getHttpServer())
      .patch(`/ordens/${criada.body.id}/status`)
      .send({ status: 'concluida' })
      .expect(200);

    expect(res.body.status).toBe('concluida');
    expect(res.body.concluidaEm).not.toBeNull();
  });

  it('mantém concluidaEm nula ao cancelar', async () => {
    const criada = await request(app.getHttpServer())
      .post('/ordens')
      .send(novaOrdem())
      .expect(201);

    const res = await request(app.getHttpServer())
      .patch(`/ordens/${criada.body.id}/status`)
      .send({ status: 'cancelada' })
      .expect(200);

    expect(res.body.status).toBe('cancelada');
    expect(res.body.concluidaEm ?? null).toBeNull();
  });

  it('responde 400 para status desconhecido', async () => {
    const criada = await request(app.getHttpServer())
      .post('/ordens')
      .send(novaOrdem())
      .expect(201);

    await request(app.getHttpServer())
      .patch(`/ordens/${criada.body.id}/status`)
      .send({ status: 'arquivada' })
      .expect(400);
  });

  it('responde 404 ao atualizar ordem inexistente', async () => {
    await request(app.getHttpServer())
      .patch('/ordens/999999/status')
      .send({ status: 'concluida' })
      .expect(404);
  });
});

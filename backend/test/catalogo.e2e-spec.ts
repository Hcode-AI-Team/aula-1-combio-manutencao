import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Catálogo (e2e)', () => {
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

  describe('UPVs', () => {
    it('cria e consulta uma UPV', async () => {
      const criada = await request(app.getHttpServer())
        .post('/upvs')
        .send({
          nome: 'UPV Catálogo',
          cidade: 'Lençóis Paulista',
          estado: 'SP',
          capacidadeMw: 21.5,
        })
        .expect(201);

      const res = await request(app.getHttpServer())
        .get(`/upvs/${criada.body.id}`)
        .expect(200);

      expect(res.body.nome).toBe('UPV Catálogo');
      expect(res.body.capacidadeMw).toBe(21.5);
    });

    it('lista as UPVs', async () => {
      const res = await request(app.getHttpServer()).get('/upvs').expect(200);

      expect(Array.isArray(res.body)).toBe(true);
    });

    it('responde 404 para UPV inexistente', async () => {
      await request(app.getHttpServer()).get('/upvs/999999').expect(404);
    });

    it('responde 400 para capacidade negativa', async () => {
      await request(app.getHttpServer())
        .post('/upvs')
        .send({
          nome: 'UPV Inválida',
          cidade: 'X',
          estado: 'SP',
          capacidadeMw: -1,
        })
        .expect(400);
    });

    it('responde 400 quando faltam campos obrigatórios', async () => {
      await request(app.getHttpServer())
        .post('/upvs')
        .send({ nome: 'Só o nome' })
        .expect(400);
    });
  });

  describe('Equipamentos', () => {
    let upvId: number;

    beforeAll(async () => {
      const upv = await request(app.getHttpServer())
        .post('/upvs')
        .send({
          nome: 'UPV Equipamentos',
          cidade: 'Sertãozinho',
          estado: 'SP',
          capacidadeMw: 30,
        })
        .expect(201);
      upvId = upv.body.id;
    });

    it('cria um equipamento vinculado à UPV', async () => {
      const res = await request(app.getHttpServer())
        .post('/equipamentos')
        .send({ tag: 'CAT-TUR-01', tipo: 'turbina', upvId })
        .expect(201);

      expect(res.body.upv.id).toBe(upvId);
    });

    it('filtra equipamentos por upvId', async () => {
      await request(app.getHttpServer())
        .post('/equipamentos')
        .send({ tag: 'CAT-BOM-01', tipo: 'bomba', upvId })
        .expect(201);

      const res = await request(app.getHttpServer())
        .get(`/equipamentos?upvId=${upvId}`)
        .expect(200);

      expect(res.body.length).toBeGreaterThanOrEqual(2);
      expect(
        res.body.every((e: { upv: { id: number } }) => e.upv.id === upvId),
      ).toBe(true);
    });

    it('responde 404 ao criar equipamento para UPV inexistente', async () => {
      await request(app.getHttpServer())
        .post('/equipamentos')
        .send({ tag: 'CAT-XXX-01', tipo: 'bomba', upvId: 999999 })
        .expect(404);
    });

    it('responde 400 para tipo fora do enum', async () => {
      await request(app.getHttpServer())
        .post('/equipamentos')
        .send({ tag: 'CAT-MOI-01', tipo: 'moinho', upvId })
        .expect(400);
    });
  });
});

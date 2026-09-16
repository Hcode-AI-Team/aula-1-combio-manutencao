import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Upv } from './upvs/upv.entity';
import {
  Equipamento,
  TipoEquipamento,
} from './equipamentos/equipamento.entity';
import {
  OrdemManutencao,
  StatusOrdem,
  TipoOrdem,
} from './ordens/ordem-manutencao.entity';

const SEED = 2026;

function mulberry32(seed: number) {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const random = mulberry32(SEED);

function pick<T>(items: T[]): T {
  return items[Math.floor(random() * items.length)];
}

function randInt(min: number, max: number): number {
  return min + Math.floor(random() * (max - min + 1));
}

const UPVS: Array<Pick<Upv, 'nome' | 'cidade' | 'estado' | 'capacidadeMw'>> = [
  {
    nome: 'UPV Lençóis Paulista',
    cidade: 'Lençóis Paulista',
    estado: 'SP',
    capacidadeMw: 45.5,
  },
  {
    nome: 'UPV Barra Bonita',
    cidade: 'Barra Bonita',
    estado: 'SP',
    capacidadeMw: 32.0,
  },
  {
    nome: 'UPV Sertãozinho',
    cidade: 'Sertãozinho',
    estado: 'SP',
    capacidadeMw: 55.2,
  },
  {
    nome: 'UPV Uberaba',
    cidade: 'Uberaba',
    estado: 'MG',
    capacidadeMw: 40.0,
  },
  {
    nome: 'UPV Uberlândia',
    cidade: 'Uberlândia',
    estado: 'MG',
    capacidadeMw: 28.7,
  },
  {
    nome: 'UPV Rio Verde',
    cidade: 'Rio Verde',
    estado: 'GO',
    capacidadeMw: 60.0,
  },
];

const TIPOS_EQUIPAMENTO: TipoEquipamento[] = [
  'caldeira',
  'turbina',
  'esteira',
  'gerador',
  'bomba',
];

const TIPOS_ORDEM: TipoOrdem[] = ['preventiva', 'corretiva', 'preditiva'];
const STATUS: StatusOrdem[] = [
  'aberta',
  'em_execucao',
  'concluida',
  'cancelada',
];

const PREFIXOS: Record<string, string> = {
  'Lençóis Paulista': 'LP',
  'Barra Bonita': 'BB',
  Sertãozinho: 'SZ',
  Uberaba: 'UB',
  Uberlândia: 'UL',
  'Rio Verde': 'RV',
};

async function seed() {
  const dataSource = new DataSource({
    type: 'better-sqlite3',
    database: process.env.SQLITE_PATH ?? 'manutencao.sqlite',
    entities: [Upv, Equipamento, OrdemManutencao],
    synchronize: true,
  });

  await dataSource.initialize();

  const upvRepo = dataSource.getRepository(Upv);
  const eqRepo = dataSource.getRepository(Equipamento);
  const ordemRepo = dataSource.getRepository(OrdemManutencao);

  await dataSource.synchronize(true);

  const now = new Date('2026-09-16T12:00:00.000Z');
  let ordemSeq = 1;

  for (const dados of UPVS) {
    const upv = await upvRepo.save(upvRepo.create(dados));
    const prefixo = PREFIXOS[dados.cidade];

    for (const tipo of TIPOS_EQUIPAMENTO) {
      const tag = `${prefixo}-${tipo.slice(0, 3).toUpperCase()}-01`;
      const equipamento = await eqRepo.save(eqRepo.create({ tag, tipo, upv }));

      const qtdOrdens = randInt(8, 15);
      for (let i = 0; i < qtdOrdens; i++) {
        const diasAtras = randInt(0, 364);
        const criadaEm = new Date(now);
        criadaEm.setUTCDate(criadaEm.getUTCDate() - diasAtras);

        const status = pick(STATUS);
        const concluidaEm =
          status === 'concluida'
            ? new Date(criadaEm.getTime() + randInt(1, 20) * 86400000)
            : undefined;

        await ordemRepo.save(
          ordemRepo.create({
            numero: `OM-${String(ordemSeq).padStart(5, '0')}`,
            descricao: `Manutenção ${pick(TIPOS_ORDEM)} no equipamento ${tag}`,
            tipo: pick(TIPOS_ORDEM),
            status,
            prioridade: randInt(1, 3) as 1 | 2 | 3,
            equipamento,
            criadaEm,
            concluidaEm,
            custoEstimado: randInt(1500, 85000),
          }),
        );
        ordemSeq += 1;
      }
    }
  }

  console.log(
    `Seed concluído: ${UPVS.length} UPVs, ${UPVS.length * 5} equipamentos, ${ordemSeq - 1} ordens.`,
  );
  await dataSource.destroy();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});

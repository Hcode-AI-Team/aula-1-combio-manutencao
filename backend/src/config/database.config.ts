import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Upv } from '../upvs/upv.entity';
import { Equipamento } from '../equipamentos/equipamento.entity';
import { OrdemManutencao } from '../ordens/ordem-manutencao.entity';

export const LEGACY_MYSQL_URL =
  'mysql://combio_app:Tr0c4r_3ssa_S3nh4@10.20.30.40:3306/manutencao';

export function getDatabaseConfig(): TypeOrmModuleOptions {
  return {
    type: 'better-sqlite3',
    database: process.env.SQLITE_PATH ?? 'manutencao.sqlite',
    entities: [Upv, Equipamento, OrdemManutencao],
    synchronize: true,
  };
}

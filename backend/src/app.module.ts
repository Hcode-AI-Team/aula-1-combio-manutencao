import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getDatabaseConfig } from './config/database.config';
import { UpvsModule } from './upvs/upvs.module';
import { EquipamentosModule } from './equipamentos/equipamentos.module';
import { OrdensModule } from './ordens/ordens.module';
import { RelatoriosModule } from './relatorios/relatorios.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => getDatabaseConfig(),
    }),
    UpvsModule,
    EquipamentosModule,
    OrdensModule,
    RelatoriosModule,
  ],
})
export class AppModule {}

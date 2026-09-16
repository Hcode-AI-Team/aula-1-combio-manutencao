import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Upv } from './upv.entity';
import { UpvsController } from './upvs.controller';
import { UpvsService } from './upvs.service';

@Module({
  imports: [TypeOrmModule.forFeature([Upv])],
  controllers: [UpvsController],
  providers: [UpvsService],
  exports: [UpvsService],
})
export class UpvsModule {}

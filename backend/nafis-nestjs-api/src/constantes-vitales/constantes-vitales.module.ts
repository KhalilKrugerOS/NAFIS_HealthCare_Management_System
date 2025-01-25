import { Module } from '@nestjs/common';
import { ConstantesVitalesService } from './constantes-vitales.service';
import { ConstantesVitalesController } from './constantes-vitales.controller';
import { MetricsModule } from 'src/metrics/metrics.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConstantesVitales } from './entities/constantes-vitale.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ConstantesVitales]),
    MetricsModule
  ],
  controllers: [ConstantesVitalesController],
  providers: [ConstantesVitalesService],
  exports: [ConstantesVitalesService]
})
export class ConstantesVitalesModule {}

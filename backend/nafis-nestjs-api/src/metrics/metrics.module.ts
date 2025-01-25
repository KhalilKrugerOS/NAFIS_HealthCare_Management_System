import { Module } from '@nestjs/common';
import { VitalsMetricsService } from './vitals-metrics.service';
import { MetricsController } from './metrics.controller';
@Module({
  providers: [VitalsMetricsService],
  controllers: [MetricsController],
  exports: [VitalsMetricsService]
})
export class MetricsModule {}
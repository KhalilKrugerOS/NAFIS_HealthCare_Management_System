import { Module } from '@nestjs/common';
import { ChambresService } from './chambres.service';
import { ChambresController } from './chambres.controller';
import { PatientsModule } from 'src/patients/patients.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chambre } from './entities/chambre.entity';
import { ChambreLog } from './entities/chambre-log.entity';  // Import ChambreLog
import { ChambreHistorique } from './entities/chambre-historique.entity';  // Import ChambreHistorique

@Module({
  imports: [
    PatientsModule,
    TypeOrmModule.forFeature([Chambre, ChambreLog, ChambreHistorique]),  // Add ChambreLog and ChambreHistorique here
  ],
  controllers: [ChambresController],
  providers: [ChambresService],
  exports: [ChambresService],
})
export class ChambresModule {}

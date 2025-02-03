import { forwardRef, Module } from '@nestjs/common';
import { ConsultationsService } from './consultations.service';
import { ConsultationsController } from './consultations.controller';
import { Consultation } from './entities/consultation.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PersonnelsModule } from 'src/personnels/personnels.module';
import { MedicalHistoryModule } from 'src/medical-history/medical-history.module';
import { MedicalHistory } from 'src/medical-history/entities/medical-history.entity';

@Module({
  imports: [
      TypeOrmModule.forFeature([Consultation,MedicalHistory]),
      forwardRef(() => PersonnelsModule),
      forwardRef(() => MedicalHistoryModule),
    ],
  controllers: [ConsultationsController],
  providers: [ConsultationsService],
  exports: [ConsultationsService],
})
export class ConsultationsModule {}

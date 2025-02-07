import { forwardRef, Module } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { PatientsController } from './patients.controller';
import { Patient } from './entities/patient.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedicalHistoryModule } from 'src/medical-history/medical-history.module';
import { Admin } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { UserModule } from 'src/user/user.module';
import { AdminModule } from 'src/admin/admin.module';
import { JwtService } from '@nestjs/jwt';
import { ConsultationsModule } from 'src/consultations/consultations.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Patient]),
    forwardRef(() => MedicalHistoryModule),
    forwardRef(() => UserModule),
    forwardRef(() => AdminModule),
    ConsultationsModule
  ],
  controllers: [PatientsController],
  providers: [PatientsService, JwtService],
  exports: [PatientsService],
})
export class PatientsModule {}
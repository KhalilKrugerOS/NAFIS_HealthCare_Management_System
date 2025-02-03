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
import { Consultation } from 'src/consultations/entities/consultation.entity';
import { DocumentsModule } from 'src/documents/documents.module';
import { ConsultationsModule } from 'src/consultations/consultations.module';
import { Document } from 'src/documents/entities/document.entity';
import { AuthModule } from 'src/auth/auth.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([Patient,Consultation,Document]),
    forwardRef(() => MedicalHistoryModule),
    forwardRef(() => UserModule),
    forwardRef(() => AdminModule),
    forwardRef(() => AuthModule),
    
    DocumentsModule,
    ConsultationsModule
  ],
  controllers: [PatientsController],
  providers: [PatientsService],
  exports: [PatientsService],
})
export class PatientsModule {}
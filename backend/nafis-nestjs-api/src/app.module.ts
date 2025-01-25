import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // Import TypeOrmModule
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MetricsModule } from './metrics/metrics.module';
import { AdminModule } from './admin/admin.module';
import { ChambresModule } from './chambres/chambres.module';
import { ConstantesVitalesModule } from './constantes-vitales/constantes-vitales.module';
import { ConsultationsModule } from './consultations/consultations.module';
import { DocumentsModule } from './documents/documents.module';
import { IoTSimulatorModule } from './iot-simulation/iot-simulation.module';
import { MqttModule } from './mqtt/mqtt.module';
import { PatientsModule } from './patients/patients.module';
import { PersonnelsModule } from './personnels/personnels.module';
import { PresencesModule } from './presences/presences.module';
import { RendezVousModule } from './rendez-vous/rendez-vous.module';
import { StatistiquesPresencesModule } from './statistiques-presences/statistiques-presences.module';
import { AlertesModule } from './alerte/entities/alerte.module';
import { Personnel } from './personnels/entities/personnel.entity';
import { Admin } from './admin/entities/admin.entity';
import { Alerte } from './alerte/entities/alerte.entity';
import { Chambre } from './chambres/entities/chambre.entity';
import { ConstantesVitales } from './constantes-vitales/entities/constantes-vitale.entity';
import { Consultation } from './consultations/entities/consultation.entity';
import { Document } from './documents/entities/document.entity';
import { Patient } from './patients/entities/patient.entity';
import { Presence } from './presences/entities/presence.entity';
import { RendezVous } from './rendez-vous/entities/rendez-vous.entity';
import { StatistiquesPresence } from './statistiques-presences/entities/statistiques-presence.entity';
import { AbsenceDetail } from './statistiques-presences/entities/absence-detail.entity';
import { CongeDetail } from './statistiques-presences/entities/conge-detail.entity';
import { MissionDetail } from './statistiques-presences/entities/mission-detail.entity';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres', 
      host: 'localhost', 
      port: 5432, 
      username: 'postgres',
      password: 'aziz',
      database: 'pg2',
      autoLoadEntities:true,
      synchronize: true, 
      logging: ['error', 'warn'],
    }),
    AlertesModule,
    MetricsModule,
    AdminModule,
    ChambresModule,
    ConstantesVitalesModule,
    ConsultationsModule,
    DocumentsModule,
    IoTSimulatorModule,
    MqttModule,
    PatientsModule,
    PersonnelsModule,
    PresencesModule,
    RendezVousModule,
    StatistiquesPresencesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

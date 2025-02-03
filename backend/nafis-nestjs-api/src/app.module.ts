/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { User } from './user/entities/user.entity';
import { MqttModule } from './mqtt/mqtt.module';
import { MedicalHistoryModule } from './medical-history/medical-history.module';
import { DocumentsModule } from './documents/documents.module';
import { AdminModule } from './admin/admin.module';
import { Admin } from './admin/entities/admin.entity';
import { Alerte } from './alerte/entities/alerte.entity';
import { Chambre } from './chambres/entities/chambre.entity';
import { ConstantesVitales } from './constantes-vitales/entities/constantes-vitale.entity';
import { Consultation } from './consultations/entities/consultation.entity';
import { Document } from './documents/entities/document.entity';
import { MedicalHistory } from './medical-history/entities/medical-history.entity';
import { Patient } from './patients/entities/patient.entity';
import { Personnel } from './personnels/entities/personnel.entity';
import { Presence } from './presences/entities/presence.entity';
import { RendezVous } from './rendez-vous/entities/rendez-vous.entity';
import { StatistiquesPresence } from './statistiques-presences/entities/statistiques-presence.entity';
import { ChambreLog } from './chambres/entities/chambre-log.entity';
import { ChambreHistorique } from './chambres/entities/chambre-historique.entity';
import { CongeDetail } from './statistiques-presences/entities/conge-detail.entity';
import { AbsenceDetail } from './statistiques-presences/entities/absence-detail.entity';
import { MissionDetail } from './statistiques-presences/entities/mission-detail.entity';
import { MessagingModule } from './messaging/messaging.module';
import { MessageEntity } from './messaging/entities/message.entity';
import { MessageRequestEntity } from './messaging/entities/message-request.entity';
import { ConversationEntity } from './messaging/entities/conversation.entity';
import { AlertesModule } from './alerte/entities/alerte.module';
import { ChambresModule } from './chambres/chambres.module';
import { ConstantesVitalesModule } from './constantes-vitales/constantes-vitales.module';
import { ConsultationsModule } from './consultations/consultations.module';
import { MetricsModule } from './metrics/metrics.module';
import { PatientsModule } from './patients/patients.module';
import { PersonnelsModule } from './personnels/personnels.module';
import { PresencesModule } from './presences/presences.module';
import { RendezVousModule } from './rendez-vous/rendez-vous.module';
import { StatistiquesPresencesModule } from './statistiques-presences/statistiques-presences.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({

      type: 'postgres',
      url: process.env.DATABASE_URL,
      synchronize: false,
      entities: [Admin,Alerte,Chambre,ConstantesVitales,Consultation,Document,MedicalHistory,Patient,Personnel,Presence,RendezVous,StatistiquesPresence,User,ChambreLog,ChambreHistorique,CongeDetail,AbsenceDetail,MissionDetail, MessageEntity, MessageRequestEntity, ConversationEntity],
      logging: true,
    }),
    TypeOrmModule.forFeature([User]),
    AuthModule,
    UserModule,
    MedicalHistoryModule,
    AdminModule,
    MessagingModule,
    AlertesModule,
    ChambresModule,
    ConstantesVitalesModule,
    ConsultationsModule,
    DocumentsModule,
    MqttModule,
    MetricsModule,
    PatientsModule,
    PersonnelsModule,
    PresencesModule,
    RendezVousModule,
    StatistiquesPresencesModule
  ],
  controllers: [AppController],
  providers: [AppService],

})
export class AppModule {}

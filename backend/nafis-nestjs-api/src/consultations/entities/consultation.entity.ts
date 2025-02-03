import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, BeforeInsert, BeforeUpdate, JoinColumn } from 'typeorm';
import { Patient } from 'src/patients/entities/patient.entity';
import { Personnel } from 'src/personnels/entities/personnel.entity';
import { MedicalHistory } from 'src/medical-history/entities/medical-history.entity';

@Entity('consultations')
export class Consultation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp', nullable: false })
  date: Date;

  // Define personnelId field for the relation
  @Column({ nullable: false })
  personnelId: number;

  @ManyToOne(() => Personnel, { nullable: false })
  @JoinColumn({ name: 'personnelId' })
  medecin: Personnel;

  @Column({ nullable: false })
  diagnostic: string;

  @Column('text', { array: true, nullable: false })
  prescriptions: string[];

  // Define patientId field for the relation
  @Column({ nullable: false })
  patientId: number;

  @ManyToOne(() => Patient, (patient) => patient.consultations)
  @JoinColumn({ name: 'patientId' })
  patient: Patient;

  @BeforeInsert()
  @BeforeUpdate()
  syncPatientId() {
    if (this.patient) {
      this.patientId = this.patient.id;  // Ensure that patientId matches the patient's actual id
    }
  }

  // Define medicalHistoryId field for the relation
  @Column({ nullable: true })
  medicalHistoryId: number;

  @ManyToOne(() => MedicalHistory, (medicalHistory) => medicalHistory.consultations, { cascade: true })
  @JoinColumn({ name: 'medicalHistoryId' })
  medicalHistory: MedicalHistory;

  // Ensure that medicalHistoryId is synchronized with the medicalHistory entity's id
  @BeforeInsert()
  @BeforeUpdate()
  syncMedicalHistoryId() {
    if (this.medicalHistory) {
      this.medicalHistoryId = this.medicalHistory.id;  // Ensure medicalHistoryId corresponds to actual id
    }
  }
}

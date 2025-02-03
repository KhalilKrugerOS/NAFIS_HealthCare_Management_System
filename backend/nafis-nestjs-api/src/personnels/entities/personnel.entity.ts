import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, ManyToOne, JoinColumn } from 'typeorm';
import { Presence } from 'src/presences/entities/presence.entity';
import { RendezVous } from 'src/rendez-vous/entities/rendez-vous.entity';
import { User } from 'src/user/entities/user.entity';
import { Admin } from 'src/admin/entities/admin.entity';
import { Consultation } from 'src/consultations/entities/consultation.entity';

export enum PersonnelType {
  MEDECIN = 'MEDECIN',
  INFIRMIER = 'INFIRMIER',
  AIDE_SOIGNANT = 'AIDE_SOIGNANT',
  ADMINISTRATIF = 'ADMINISTRATIF',
  TECHNICIEN = 'TECHNICIEN',
  VIDE = 'VIDE'
}

export enum PersonnelCategorie {
  TITULAIRE = 'TITULAIRE',
  CONTRACTUEL = 'CONTRACTUEL',
  VACATAIRE = 'VACATAIRE',
  STAGIAIRE = 'STAGIAIRE',
  RESIDENT = 'RESIDENT',
  VIDE = 'VIDE'
}

export enum Specialite {
  CARDIOLOGIE = 'CARDIOLOGIE',
  PEDIATRIE = 'PEDIATRIE',
  NEUROLOGIE = 'NEUROLOGIE',
  URGENCES = 'URGENCES',
  CHIRURGIE = 'CHIRURGIE',
  RADIOLOGIE = 'RADIOLOGIE',
  PSYCHIATRIE = 'PSYCHIATRIE',
  GENERALISTE = 'GENERALISTE',
  AUTRE = 'AUTRE',
  VIDE = 'VIDE'
}

export enum PersonnelStatut {
  PRESENT = 'PRESENT',
  ABSENT = 'ABSENT',
  CONGE = 'CONGE',
  MISSION = 'MISSION',
  VIDE = 'VIDE'
}

@Entity('personnels')
export class Personnel {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, { onDelete: 'CASCADE', eager: true }) // Use the same structure as Patient
  @JoinColumn()
  user: User; // Directly link the personnel to the user

  @Column({
    type: 'enum',
    enum: PersonnelType,
    enumName: 'personnel_type',
  })
  type: PersonnelType;

  @Column({
    type: 'enum',
    enum: PersonnelCategorie,
    enumName: 'personnel_categorie',
  })
  categorie: PersonnelCategorie;

  @Column({
    type: 'enum',
    enum: Specialite,
    enumName: 'personnel_specialite',
  })
  specialite: Specialite;

  @Column()
  service: string;

  @Column()
  matricule: string;

  @Column({ type: 'date' })
  dateRecrutement: Date;

  @Column({
    type: 'enum',
    enum: PersonnelStatut,
    default: PersonnelStatut.PRESENT,
    enumName: 'personnel_statut',
  })
  statut: PersonnelStatut;

  @OneToMany(() => Presence, (presence) => presence.personnelId)
  presences: Presence[];

  @OneToMany(() => RendezVous, (rendezvous) => rendezvous.medecinId)
  rendezvous: RendezVous[];

  @ManyToOne(() => Admin, (admin) => admin.personnels)
  admin: Admin;
  @OneToMany(() => Consultation, (consultation) => consultation.medecin)
  consultations: Consultation[];
}

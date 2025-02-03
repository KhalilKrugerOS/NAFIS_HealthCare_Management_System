/* eslint-disable prettier/prettier */
import { Patient } from 'src/patients/entities/patient.entity';
import { Personnel } from 'src/personnels/entities/personnel.entity';
import { User } from 'src/user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, OneToMany, OneToOne, JoinColumn } from 'typeorm';

@Entity('admins')
export class Admin {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => User, (user) => user.admin, { cascade: true }) // ⬅ Allow an Admin to have multiple Users
  users: User[];



  @OneToMany(() => Patient, (patient) => patient.admin)
  patients: Patient[];
  @OneToMany(() => Personnel, (personnel) => personnel.admin)
  personnels: Personnel[];
  

}
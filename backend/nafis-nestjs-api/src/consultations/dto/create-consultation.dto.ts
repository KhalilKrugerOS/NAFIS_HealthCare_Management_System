import { IsString, IsDateString, IsArray, IsNotEmpty, IsInt } from 'class-validator';
import { Patient } from 'src/patients/entities/patient.entity';
import { Personnel } from 'src/personnels/entities/personnel.entity';

export class CreateConsultationDto {
  @IsDateString()
  @IsNotEmpty()
  date: Date;

  @IsInt()
  @IsNotEmpty()
  // Use Personnel's id instead of the medecin's name
  medecinId: number;

  @IsString()
  @IsNotEmpty()
  diagnostic: string;

  @IsArray()
  @IsNotEmpty()
  prescriptions: string[];

  @IsInt()
  @IsNotEmpty()
  patientId: number;

  // Optional: If you want to include the patient data in the DTO
  patient?: Patient;
}

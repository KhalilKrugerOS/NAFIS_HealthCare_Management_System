import { IsNotEmpty, IsArray, IsString, IsInt, IsOptional, IsDateString } from 'class-validator';

export class CreateConsultationDto {
  @IsNotEmpty()
  @IsDateString()
  date: Date;

  @IsNotEmpty()
  @IsString()
  diagnostic: string;

  @IsArray()
  @IsNotEmpty()
  prescriptions: string[];

  @IsInt()
  @IsNotEmpty()
  patientId: number;

  @IsInt()
  @IsNotEmpty()
  medecinId: number; // This is for the doctor (personnel)

  @IsInt()
  @IsOptional() // Medical history is optional (can be null)
  medicalHistoryId?: number;
}

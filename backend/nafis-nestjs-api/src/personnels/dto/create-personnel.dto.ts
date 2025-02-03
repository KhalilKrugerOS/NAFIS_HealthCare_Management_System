import { IsNotEmpty, IsEnum, IsDateString, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { PersonnelType, PersonnelCategorie, Specialite, PersonnelStatut } from '../entities/personnel.entity';
import { SignupDto } from 'src/auth/dto/signup.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Consultation } from 'src/consultations/entities/consultation.entity';

// Optional DTO for nested consultations if needed
export class ConsultationDto {
  @IsDateString()
  @IsNotEmpty()
  date: Date;

  @IsNotEmpty()
  diagnostic: string;

  @IsArray()
  @IsNotEmpty()
  prescriptions: string[];

  @IsNotEmpty()
  patientId: number;

  @IsOptional()
  medicalHistoryId?: number;
}

export class CreatePersonnelDto extends SignupDto {
  @ApiPropertyOptional({ enum: PersonnelType, default: PersonnelType.MEDECIN })
  @IsOptional()
  @IsEnum(PersonnelType)
  type?: PersonnelType = PersonnelType.MEDECIN;

  @ApiPropertyOptional({ enum: PersonnelCategorie })
  @IsOptional()
  @IsEnum(PersonnelCategorie)
  categorie?: PersonnelCategorie;

  @ApiPropertyOptional({ enum: Specialite })
  @IsOptional()
  @IsEnum(Specialite)
  specialite?: Specialite;

  @ApiPropertyOptional()
  @IsOptional()
  service?: string;

  @ApiPropertyOptional()
  @IsOptional()
  matricule?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  dateRecrutement?: Date;

  @ApiPropertyOptional({ enum: PersonnelStatut })
  @IsOptional()
  @IsEnum(PersonnelStatut)
  statut?: PersonnelStatut;

  @ApiPropertyOptional({ type: [ConsultationDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ConsultationDto)
  consultations?: ConsultationDto[];

  // If you want to track availability for consultations
  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsDateString({}, { each: true })
  availableSlots?: Date[];

  // If you want to track consultation hours
  @ApiPropertyOptional()
  @IsOptional()
  consultationHours?: {
    start: string;
    end: string;
    daysOfWeek: string[];
  };

  // Maximum consultations per day
  @ApiPropertyOptional()
  @IsOptional()
  maxConsultationsPerDay?: number;
}
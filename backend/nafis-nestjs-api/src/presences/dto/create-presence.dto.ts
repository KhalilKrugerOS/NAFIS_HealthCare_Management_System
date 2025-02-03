import { IsEnum, IsNotEmpty, IsOptional, IsBoolean, IsDateString, IsString, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';
import { PersonnelStatut } from 'src/personnels/entities/personnel.entity';
import { CongeType } from 'src/statistiques-presences/entities/conge-detail.entity';

export class CreatePresenceDto {
  @IsNotEmpty()
  @IsDateString()
  @Transform(({ value }) => new Date(value)) // Converts the string to a Date object
  date: Date;

  @IsNotEmpty()
  @IsEnum(PersonnelStatut)
  statut: PersonnelStatut;

  @IsNotEmpty()
  @IsNumber()
  personnelId: number;

  @IsOptional()
  @IsString()
  commentaire?: string;

  // Fields for ABSENT
  @IsOptional()
  @IsBoolean()
  justifie?: boolean;

  @IsOptional()
  @IsString()
  motif?: string;

  // Fields for CONGE
  @IsOptional()
  @IsDateString()
  @Transform(({ value }) => (value ? new Date(value) : undefined))
  debut?: Date;

  @IsOptional()
  @IsDateString()
  @Transform(({ value }) => (value ? new Date(value) : undefined))
  fin?: Date;

  @IsOptional()
  @IsEnum(CongeType)
  type?: CongeType;

  // Fields for MISSION
  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  lieu?: string;
}

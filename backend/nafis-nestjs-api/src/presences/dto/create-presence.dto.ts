import { IsString, IsNotEmpty, IsOptional, IsInt, IsDateString, IsEnum } from 'class-validator';
import { PersonnelStatut } from 'src/personnels/entities/personnel.entity';

export class CreatePresenceDto {
  @IsDateString()
  @IsNotEmpty()
  date: string;

  @IsNotEmpty()
  @IsEnum(PersonnelStatut)  
  statut: PersonnelStatut;


  @IsInt()
  @IsNotEmpty()
  personnelId: number;

  @IsOptional()
  @IsString()
  commentaire?: string;
}

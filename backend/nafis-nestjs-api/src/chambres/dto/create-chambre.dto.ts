import { IsNotEmpty, IsEnum, IsOptional, IsNumber, IsDateString } from 'class-validator';
import { ChambreType, ChambreStatut } from '../entities/chambre.entity';  

export class CreateChambreDto {
  @IsNotEmpty()
  @IsEnum(ChambreType)  
  type: ChambreType;

  @IsNotEmpty()
  @IsEnum(ChambreStatut)  
  statut: ChambreStatut;

  @IsOptional()
  @IsNumber()
  patientId?: number;

  @IsOptional()
  @IsDateString()
  dernierNettoyage?: string;
}

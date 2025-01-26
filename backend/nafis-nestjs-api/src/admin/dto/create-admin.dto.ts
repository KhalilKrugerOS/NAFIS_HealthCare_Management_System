import { IsString, IsNotEmpty, IsEmail, IsDateString, IsOptional } from 'class-validator';

export class CreateAdminDto {
  @IsNotEmpty()
  @IsString()
  nom: string;

  @IsNotEmpty()
  @IsString()
  prenom: string;

  @IsNotEmpty()
  @IsDateString()
  dateNaissance: Date;  

  @IsNotEmpty()
  @IsString()
  numeroSecu: string;

  @IsNotEmpty()
  @IsString()
  adresse: string;

  @IsNotEmpty()
  @IsString()
  telephone: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  photoUrl?: string;
}

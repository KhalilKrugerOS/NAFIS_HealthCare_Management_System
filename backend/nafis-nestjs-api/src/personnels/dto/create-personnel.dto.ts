import { IsString, IsNotEmpty, IsEmail, IsEnum } from 'class-validator';
import { CreatePersonBaseDto } from 'src/common/dto/create-person-base.dto';
import { PersonnelStatut } from '../entities/personnel.entity';

export class CreatePersonnelDto extends CreatePersonBaseDto {
  @IsNotEmpty()
  @IsString()
  fonction: string;

  @IsNotEmpty()
  @IsString()
  service: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsEnum(PersonnelStatut) 
  statut: PersonnelStatut;
}

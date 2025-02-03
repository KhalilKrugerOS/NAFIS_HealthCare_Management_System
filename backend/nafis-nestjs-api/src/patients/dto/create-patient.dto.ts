import { SignupDto } from 'src/auth/dto/signup.dto';
import { IsOptional, IsString } from 'class-validator';

export class CreatePatientDto extends SignupDto {
  @IsOptional()
  @IsString()
  adresse?: string;

  @IsOptional()
  @IsString()
  telephone?: string;

  @IsOptional()
  @IsString()
  photoUrl?: string;

  @IsOptional()
  admin?: { id: number };
}

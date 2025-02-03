import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PatientsModule } from 'src/patients/patients.module';
import { AdminModule } from 'src/admin/admin.module';
import { forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Admin } from 'src/admin/entities/admin.entity';
import { PersonnelsModule } from 'src/personnels/personnels.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports:[
    TypeOrmModule.forFeature([User,Admin]),
    forwardRef(() => PatientsModule),
    forwardRef(() => AdminModule),
    forwardRef(() => PersonnelsModule),
    forwardRef(() => AuthModule),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}

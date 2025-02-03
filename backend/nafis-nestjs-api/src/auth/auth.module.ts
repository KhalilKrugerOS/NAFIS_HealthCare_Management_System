import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt-strategy';
import { JwtModule } from '@nestjs/jwt';
import { User } from '../user/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PatientsModule } from 'src/patients/patients.module';
import { AdminModule } from 'src/admin/admin.module';
import { UserModule } from 'src/user/user.module';
import { AuthGuard } from 'src/guards/jwt-auth.guard';
import { RoleAccessControlGuard } from 'src/guards/roles.guard';
import { PersonnelsModule } from 'src/personnels/personnels.module';
import { JwtService } from "@nestjs/jwt";
import { Reflector } from '@nestjs/core';
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          secret: config.get<string>('JWT_SECRET'),
          signOptions: {
            expiresIn: config.get<string | number>('JWT_EXPIRES'),
          },
        };
      },
    }),
    forwardRef(() => PatientsModule),
    
    forwardRef(() => AdminModule),
    
    forwardRef(() => UserModule),
    forwardRef(() => PersonnelsModule),

     
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy,AuthGuard,  // Add AuthGuard here
    RoleAccessControlGuard,Reflector],
    exports:[AuthService, JwtStrategy,AuthGuard,  // Add AuthGuard here
      RoleAccessControlGuard,JwtModule]
})
export class AuthModule {}

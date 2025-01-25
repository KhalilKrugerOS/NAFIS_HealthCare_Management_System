import { Module } from '@nestjs/common';
import { PersonnelsService } from './personnels.service';
import { PersonnelsController } from './personnels.controller';
import { Personnel } from './entities/personnel.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PresencesService } from 'src/presences/presences.service';
import { PresencesModule } from 'src/presences/presences.module';

@Module({
  imports: [
      TypeOrmModule.forFeature([Personnel]),
      PresencesModule
    ],
  controllers: [PersonnelsController],
  providers: [PersonnelsService],
})
export class PersonnelsModule {}

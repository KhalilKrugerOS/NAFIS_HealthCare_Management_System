import { forwardRef, Module } from '@nestjs/common';
import { PresencesService } from './presences.service';
import { PresencesController } from './presences.controller';
import { Presence } from './entities/presence.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatistiquesPresencesModule } from 'src/statistiques-presences/statistiques-presences.module';

@Module({
  imports: [
      TypeOrmModule.forFeature([Presence]),
      forwardRef(() => StatistiquesPresencesModule),
    ],
  controllers: [PresencesController],
  providers: [PresencesService],
  exports: [PresencesService],
})
export class PresencesModule {}

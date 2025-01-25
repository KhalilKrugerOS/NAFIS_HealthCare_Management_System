import { Module } from '@nestjs/common';
import { ChambresService } from './chambres.service';
import { ChambresController } from './chambres.controller';
import { Chambre } from './entities/chambre.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Chambre]) 
  ],
  controllers: [ChambresController],
  providers: [ChambresService],
})
export class ChambresModule {}

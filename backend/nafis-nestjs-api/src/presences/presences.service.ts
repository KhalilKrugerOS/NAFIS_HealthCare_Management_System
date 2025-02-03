import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePresenceDto } from './dto/create-presence.dto';
import { UpdatePresenceDto } from './dto/update-presence.dto';
import { Presence } from './entities/presence.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StatistiquesPresencesService } from 'src/statistiques-presences/statistiques-presences.service';

@Injectable()
export class PresencesService {
  constructor(
    @InjectRepository(Presence)
    private readonly presencesRepository: Repository<Presence>,
    @Inject(forwardRef(() => StatistiquesPresencesService)) // Use forwardRef here
    private readonly statistiquesPresencesService: StatistiquesPresencesService, // Inject StatistiquesPresencesService with forwardRef // Corrected the typo here
  ) {}

  async create(createPresenceDto: CreatePresenceDto): Promise<Presence> {
    // Ensure the date fields are properly converted to Date objects
    const presence = this.presencesRepository.create({
      ...createPresenceDto,
      date: new Date(createPresenceDto.date), // Ensure date is a Date object
      debut: createPresenceDto.debut ? new Date(createPresenceDto.debut) : undefined,
      fin: createPresenceDto.fin ? new Date(createPresenceDto.fin) : undefined,
    });

    // Save the presence record
    const savedPresence = await this.presencesRepository.save(presence);

    // Check if it's the first time a presence is being created for this personnel and month
    const mois = savedPresence.date.toISOString().slice(0, 7); // Get the month in 'YYYY-MM' format
    const existingStatistiques = await this.statistiquesPresencesService.findByPersonnelAndMonth(savedPresence.personnelId, mois);

    let updatedStatistiques;
    if (!existingStatistiques) {
      // If no existing StatistiquesPresence, create a new one with initial values
      updatedStatistiques = {
        personnelId: savedPresence.personnelId,
        mois,
        joursPresent: 0,
        joursAbsent: 0,
        joursConge: 0,
        joursMission: 0,
        tauxPresence: 0, // Initial presence rate
        presencesDetaillees: [savedPresence.id], // Store the presence ID in the presencesDetaillees array
        conges: [],
        absences: [],
        missions: [],
      };
    } else {
      // If a StatistiquesPresence exists, update it
      updatedStatistiques = {
        ...existingStatistiques,
        presencesDetaillees: [...existingStatistiques.presencesDetaillees, savedPresence.id], // Add the new presence ID
      };

      // Increment counters based on the presence status
      if (savedPresence.statut === 'PRESENT') {
        updatedStatistiques.joursPresent += 1;
      } else if (savedPresence.statut === 'ABSENT') {
        updatedStatistiques.joursAbsent += 1;
      } else if (savedPresence.statut === 'CONGE') {
        updatedStatistiques.joursConge += 1;
      } else if (savedPresence.statut === 'MISSION') {
        updatedStatistiques.joursMission += 1;
      }
      
      // Recalculate the tauxPresence (attendance rate)
      const totalDays = updatedStatistiques.joursPresent + updatedStatistiques.joursAbsent;
      updatedStatistiques.tauxPresence = totalDays > 0
        ? (updatedStatistiques.joursPresent / totalDays) * 100
        : 0;
    }

    // Save the updated statistics
    if (existingStatistiques) {
      await this.statistiquesPresencesService.update(existingStatistiques.id, updatedStatistiques);
    } else {
      await this.statistiquesPresencesService.create(updatedStatistiques);
    }

    return savedPresence;
  }

  async findAll(): Promise<Presence[]> {
    return await this.presencesRepository.find({ relations: ['personnel'] });
  }

  async findOne(id: number): Promise<Presence> {
    const presence = await this.presencesRepository.findOne({
      where: { id },
      relations: ['personnel'],
    });

    if (!presence) {
      throw new NotFoundException(`Presence with ID ${id} not found`);
    }
    return presence;
  }

  async update(id: number, updatePresenceDto: UpdatePresenceDto): Promise<Presence> {
    const presence = await this.findOne(id);

    // Update presence fields based on DTO
    Object.assign(presence, {
      ...updatePresenceDto,
      date: updatePresenceDto.date ? new Date(updatePresenceDto.date) : presence.date,
      debut: updatePresenceDto.debut ? new Date(updatePresenceDto.debut) : presence.debut,
      fin: updatePresenceDto.fin ? new Date(updatePresenceDto.fin) : presence.fin,
    });

    // Save the updated presence
    const updatedPresence = await this.presencesRepository.save(presence);

    // After updating, we need to update the related StatistiquesPresence
    const mois = updatedPresence.date.toISOString().slice(0, 7); // Get the month in 'YYYY-MM' format
    const existingStatistiques = await this.statistiquesPresencesService.findByPersonnelAndMonth(updatedPresence.personnelId, mois);

    let updatedStatistiques;
    if (existingStatistiques) {
      updatedStatistiques = {
        ...existingStatistiques,
        presencesDetaillees: [
          ...existingStatistiques.presencesDetaillees.filter(id => id !== updatedPresence), // Remove old presence ID
          updatedPresence.id, // Add updated presence ID
        ],
      };

      // Increment counters based on the presence status
      if (updatedPresence.statut === 'PRESENT') {
        updatedStatistiques.joursPresent += 1;
      } else if (updatedPresence.statut === 'ABSENT') {
        updatedStatistiques.joursAbsent += 1;
      } else if (updatedPresence.statut === 'CONGE') {
        updatedStatistiques.joursConge += 1;
      } else if (updatedPresence.statut === 'MISSION') {
        updatedStatistiques.joursMission += 1;
      }

      // Recalculate the tauxPresence (attendance rate)
      const totalDays = updatedStatistiques.joursPresent + updatedStatistiques.joursAbsent;
      updatedStatistiques.tauxPresence = totalDays > 0
        ? (updatedStatistiques.joursPresent / totalDays) * 100
        : 0;

      await this.statistiquesPresencesService.update(existingStatistiques.id, updatedStatistiques);
    }

    return updatedPresence;
  }

  async remove(id: number): Promise<Presence> {
    const presence = await this.findOne(id);
    return await this.presencesRepository.remove(presence);
  }

  async findByPersonnelId(personnelId: number): Promise<Presence[]> {
    return await this.presencesRepository.find({
      where: { personnelId },
      relations: ['personnel'],
    });
  }
}

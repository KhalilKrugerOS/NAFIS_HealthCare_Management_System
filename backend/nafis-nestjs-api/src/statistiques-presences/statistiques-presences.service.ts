import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateStatistiquesPresenceDto } from './dto/create-statistiques-presence.dto';
import { UpdateStatistiquesPresenceDto } from './dto/update-statistiques-presence.dto';
import { StatistiquesPresence } from './entities/statistiques-presence.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PresencesService } from 'src/presences/presences.service';
import { CongeDetail, CongeType } from './entities/conge-detail.entity';
import { AbsenceDetail } from './entities/absence-detail.entity';
import { MissionDetail } from './entities/mission-detail.entity';
import { Presence } from 'src/presences/entities/presence.entity';

@Injectable()
export class StatistiquesPresencesService {
  constructor(
    @InjectRepository(StatistiquesPresence)
    private readonly statsRepository: Repository<StatistiquesPresence>,
    @Inject(forwardRef(() => PresencesService)) // Use forwardRef here
    private readonly presenceService: PresencesService,
    @InjectRepository(CongeDetail)
    private readonly congeRepository: Repository<CongeDetail>,
    @InjectRepository(AbsenceDetail)
    private readonly absenceRepository: Repository<AbsenceDetail>,
    @InjectRepository(MissionDetail)
    private readonly missionRepository: Repository<MissionDetail>,
  ) {}

  async create(createStatistiquesPresenceDto: CreateStatistiquesPresenceDto) {
    const { personnelId, mois } = createStatistiquesPresenceDto;

    const presences = await this.presenceService.findByPersonnelId(personnelId);
    const filteredPresences = presences.filter((presence) => {
      const formattedDate = presence.date.toISOString().slice(0, 7); // Format as 'YYYY-MM'
      return formattedDate === mois;
    });
    

    let joursPresent = 0;
    let joursAbsent = 0;
    let joursConge = 0;
    let joursMission = 0;

    const conges: CongeDetail[] = [];
    const absences: AbsenceDetail[] = [];
    const missions: MissionDetail[] = [];
    const presencesDetaillees: Presence[] = [];

    for (const presence of filteredPresences) {
      presencesDetaillees.push(presence);

      switch (presence.statut) {
        case 'PRESENT':
          joursPresent++;
          break;
        case 'ABSENT':
          joursAbsent++;
          absences.push(
            this.absenceRepository.create({
              personnelId,
              date: presence.date,
              justifie: presence.justifie,
              motif: presence.commentaire,
            }),
          );
          break;
        case 'CONGE':
          joursConge++;
          conges.push(
            this.congeRepository.create({
              personnelId,
              debut: presence.debut,
              fin: presence.fin,
              type: presence.type as CongeType,
              motif: presence.commentaire,
            }),
          );
          break;
        case 'MISSION':
          joursMission++;
          missions.push(
            this.missionRepository.create({
              personnelId,
              debut: presence.debut,
              fin: presence.fin,
              description: presence.description,
              lieu: presence.lieu,
            }),
          );
          break;
      }
    }

    const totalDays = joursPresent + joursAbsent + joursConge + joursMission;
    const tauxPresence = totalDays > 0 ? (joursPresent / totalDays) * 100 : 0;

    const stat = this.statsRepository.create({
      personnelId,
      mois,
      joursPresent,
      joursAbsent,
      joursConge,
      joursMission,
      tauxPresence,
      presencesDetaillees,
      conges,
      absences,
      missions,
    });

    return await this.statsRepository.save(stat);
  }

  async update(id: number, updateStatistiquesPresenceDto: UpdateStatistiquesPresenceDto) {
    const { personnelId, mois } = updateStatistiquesPresenceDto;

    const stat = await this.findOne(id);
    if (!stat) {
      throw new NotFoundException(`StatistiquesPresence with ID ${id} not found`);
    }

    const presences = await this.presenceService.findByPersonnelId(personnelId);
    const filteredPresences = presences.filter((presence) => {
      const formattedDate = presence.date.toISOString().slice(0, 7); // Format as 'YYYY-MM'
      return formattedDate === mois;
    });
    

    let joursPresent = 0;
    let joursAbsent = 0;
    let joursConge = 0;
    let joursMission = 0;

    const conges: CongeDetail[] = [];
    const absences: AbsenceDetail[] = [];
    const missions: MissionDetail[] = [];
    const presencesDetaillees: Presence[] = [];

    for (const presence of filteredPresences) {
      presencesDetaillees.push(presence);

      switch (presence.statut) {
        case 'PRESENT':
          joursPresent++;
          break;
        case 'ABSENT':
          joursAbsent++;
          absences.push(
            this.absenceRepository.create({
              personnelId,
              date: presence.date,
              justifie: presence.justifie,
              motif: presence.description,
            }),
          );
          break;
        case 'CONGE':
          joursConge++;
          conges.push(
            this.congeRepository.create({
              personnelId,
              debut: presence.debut,
              fin: presence.fin,
              type: presence.type as CongeType,
              motif: presence.description,
            }),
          );
          break;
        case 'MISSION':
          joursMission++;
          missions.push(
            this.missionRepository.create({
              personnelId,
              debut: presence.debut,
              fin: presence.fin,
              description: presence.description,
              lieu: presence.lieu,
            }),
          );
          break;
      }
    }

    const totalDays = joursPresent + joursAbsent + joursConge + joursMission;
    const tauxPresence = totalDays > 0 ? (joursPresent / totalDays) * 100 : 0;

    Object.assign(stat, {
      personnelId,
      mois,
      joursPresent,
      joursAbsent,
      joursConge,
      joursMission,
      tauxPresence,
      presencesDetaillees,
      conges,
      absences,
      missions,
    });

    return await this.statsRepository.save(stat);
  }
  async findOne(id: number): Promise<StatistiquesPresence> {
    const stat = await this.statsRepository.findOne({
      where: { id },
      relations: ['presencesDetaillees', 'conges', 'absences', 'missions'], // Include related entities
    });
  
    if (!stat) {
      throw new NotFoundException(`StatistiquesPresence with ID ${id} not found`);
    }
  
    return stat;
  }
  
  async findAll(): Promise<StatistiquesPresence[]> {
    return await this.statsRepository.find({
      relations: ['presencesDetaillees', 'conges', 'absences', 'missions'], // Include related entities
    });
  }
  
  async remove(id: number): Promise<void> {
    const stat = await this.findOne(id); // Ensure the record exists
    await this.statsRepository.remove(stat);
  }
  async findByPersonnelAndMonth(personnelId: number, mois: string): Promise<StatistiquesPresence | undefined> {
    return await this.statsRepository.findOne({
      where: { personnelId, mois },
    });
  }
  
}

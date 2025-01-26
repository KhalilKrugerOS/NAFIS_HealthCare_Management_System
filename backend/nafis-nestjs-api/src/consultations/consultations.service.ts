import { Injectable, NotFoundException, BadRequestException, forwardRef, Inject } from '@nestjs/common';
import { CreateConsultationDto } from './dto/create-consultation.dto';
import { UpdateConsultationDto } from './dto/update-consultation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Consultation } from './entities/consultation.entity';
import { Repository } from 'typeorm';
import { PersonnelsService } from 'src/personnels/personnels.service';
import { PersonnelType } from 'src/personnels/entities/personnel.entity';

@Injectable()
export class ConsultationsService {
  constructor(
    @InjectRepository(Consultation)
    private readonly consultationsRepository: Repository<Consultation>,
    @Inject(forwardRef(() => PersonnelsService))
    private readonly personnelService: PersonnelsService, // Inject PersonnelService
  ) {}

  async create(createConsultationDto: CreateConsultationDto) {
    // Validate that the selected personnel is a doctor (MEDECIN) using medecinId
    await this.validateMedecinType(createConsultationDto.medecinId);

    // Create and save the consultation after validation
    const consultation = this.consultationsRepository.create(createConsultationDto);
    return await this.consultationsRepository.save(consultation);
  }

  async findAll() {
    return await this.consultationsRepository.find();
  }

  async findOne(id: number) {
    return await this.consultationsRepository.findOne({ where: { id } });
  }

  async update(id: number, updateConsultationDto: UpdateConsultationDto) {
    const consultation = await this.findOne(id);
    if (!consultation) {
      throw new NotFoundException();
    }

    // If the medecinId is being updated, validate the new medecinId
    if (updateConsultationDto.medecinId && updateConsultationDto.medecinId !== consultation.medecin.id) {
      await this.validateMedecinType(updateConsultationDto.medecinId);
    }

    // Update the consultation with the new data
    Object.assign(consultation, updateConsultationDto);
    return await this.consultationsRepository.save(consultation);
  }

  async remove(id: number) {
    const consultation = await this.findOne(id);
    if (!consultation) {
      throw new NotFoundException();
    }
    return await this.consultationsRepository.remove(consultation);
  }

  // Method to validate if the medecinId corresponds to a doctor (MEDECIN)
  private async validateMedecinType(medecinId: number) {
    const personnel = await this.personnelService.findOne(medecinId);
    if (!personnel) {
      throw new NotFoundException('Personnel not found');
    }

    if (personnel.type !== PersonnelType.MEDECIN) {
      throw new BadRequestException('The selected personnel must be a doctor (MEDECIN)');
    }
  }
}

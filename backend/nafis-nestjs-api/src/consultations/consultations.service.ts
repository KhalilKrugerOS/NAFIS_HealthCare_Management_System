import { Injectable, NotFoundException, BadRequestException, forwardRef, Inject } from '@nestjs/common';
import { CreateConsultationDto } from './dto/create-consultation.dto';
import { UpdateConsultationDto } from './dto/update-consultation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Consultation } from './entities/consultation.entity';
import { Repository } from 'typeorm';
import { PersonnelsService } from 'src/personnels/personnels.service';
import { PersonnelType } from 'src/personnels/entities/personnel.entity';
import { MedicalHistory } from 'src/medical-history/entities/medical-history.entity';

@Injectable()
export class ConsultationsService {
  constructor(
    @InjectRepository(Consultation)
    private readonly consultationsRepository: Repository<Consultation>,
    @Inject(forwardRef(() => PersonnelsService))
    private readonly personnelService: PersonnelsService,
    @InjectRepository(MedicalHistory)
    private readonly medicalHistoryRepository: Repository<MedicalHistory>
  ) {}


  async create(createConsultationDto: CreateConsultationDto) {
    // Validate that the selected personnel is a doctor (MEDECIN)
    console.log(createConsultationDto)
    const medecin = await this.personnelService.findOne(createConsultationDto.medecinId);
   
    if (!medecin || medecin.type !== PersonnelType.MEDECIN) {
      throw new BadRequestException('The selected personnel must be a doctor (MEDECIN)');
    }
  
    // Check if medicalHistoryId is provided in the DTO
    let medicalHistory;
    if (createConsultationDto.medicalHistoryId) {
      // If medicalHistoryId is provided, fetch the existing medical history
      medicalHistory = await this.medicalHistoryRepository.findOne({
        where: { id: createConsultationDto.medicalHistoryId },
      });
  
      if (!medicalHistory) {
        throw new BadRequestException('The provided medical history does not exist');
      }
    } else {
      // If no medicalHistoryId is provided, check if the patient has an existing medical history
      medicalHistory = await this.medicalHistoryRepository.findOne({
        where: { patient: { id: createConsultationDto.patientId } },
        relations: ['patient'],
      });
  
      // If no medical history exists, create one
      if (!medicalHistory) {
        medicalHistory = this.medicalHistoryRepository.create({
          patient: { id: createConsultationDto.patientId },
        });
        await this.medicalHistoryRepository.save(medicalHistory);
      }
    }
  
    // Create the consultation entity and associate medical history
    const consultation = this.consultationsRepository.create({
      ...createConsultationDto,
      medecin,        // Associate with the selected medecin
      medicalHistory, // Associate with the found or created medical history
    });
  
    // Save the consultation
    return await this.consultationsRepository.save(consultation);
  }
  async findByPatientId(patientId: number): Promise<Consultation[]> {
    return await this.consultationsRepository.find({ where: { patientId } });
  }
  
  

  async findAll() {
    return await this.consultationsRepository.find();
  }

  async findOne(id: number) {
    return await this.consultationsRepository.findOne({ where: { id } });
  }

  async update(a: { id: number; updateConsultationDto: UpdateConsultationDto; }) {
    const consultation = await this.findOne(a.id);
    if (!consultation) {
      throw new NotFoundException('Consultation not found');
    }
  
    // If the medecinId is being updated, validate the new medecinId
    if (a.updateConsultationDto.medecinId && a.updateConsultationDto.medecinId !== consultation.medecin.id) {
      // Validate the new medecinId
      const medecin = await this.personnelService.findOne(a.updateConsultationDto.medecinId);
      if (!medecin || medecin.type !== PersonnelType.MEDECIN) {
        throw new BadRequestException('The selected personnel must be a doctor (MEDECIN)');
      }
  
      // Explicitly set the medecin relationship
      consultation.medecin = medecin;
    }
  
    // Update the consultation with the new data
    Object.assign(consultation, a.updateConsultationDto);
  
    // Save the updated consultation
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

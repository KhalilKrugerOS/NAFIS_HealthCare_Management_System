import { ConflictException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePersonnelDto } from './dto/create-personnel.dto';
import { UpdatePersonnelDto } from './dto/update-personnel.dto';
import { Personnel, PersonnelCategorie, PersonnelStatut, PersonnelType, Specialite } from './entities/personnel.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PresencesService } from 'src/presences/presences.service';
import { ConsultationsService } from 'src/consultations/consultations.service';
import { UserService } from 'src/user/user.service';
import { CreatePresenceDto } from 'src/presences/dto/create-presence.dto';
import { CongeType } from 'src/statistiques-presences/entities/conge-detail.entity';

@Injectable()
export class PersonnelsService {
  constructor(
    @InjectRepository(Personnel)
    private readonly personnelsRepository: Repository<Personnel>,
    private readonly presencesService: PresencesService,
    @Inject(forwardRef(() => ConsultationsService))
    private readonly consultationService: ConsultationsService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  async create(userId: number, newPersonnelData: CreatePersonnelDto): Promise<Personnel> {
    try {
      // Fetch the existing user by ID
      const user = await this.userService.findOne(userId);
      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }
  
      // Ensure that optional fields are set with a default if they are not provided
      const newPersonnel = this.personnelsRepository.create({
        ...newPersonnelData,
        user, // Assign the existing user
        statut: newPersonnelData.statut ?? PersonnelStatut.CONGE, // Default to "CONGE" if not provided
        type: newPersonnelData.type ?? PersonnelType.MEDECIN, // Default to "MEDECIN" if not provided
        categorie: newPersonnelData.categorie ?? PersonnelCategorie.TITULAIRE, // Default to "TITULAIRE" if not provided
        specialite: newPersonnelData.specialite ?? Specialite.GENERALISTE, // Default to "GENERALISTE" if not provided
        service: newPersonnelData.service ?? 'Cardiologie', // Default to a valid service
        matricule: newPersonnelData.matricule ?? 'M123456', // Default to a sample matricule
        dateRecrutement: newPersonnelData.dateRecrutement ?? new Date(), // Default to current date if not provided
      });
  
      // Save Personnel in DB
      const savedPersonnel = await this.personnelsRepository.save(newPersonnel);
  
      // Construct the Presence object
      const createPresenceDto: CreatePresenceDto = {
        date: new Date(),
        statut: savedPersonnel.statut,
        personnelId: savedPersonnel.id,
      };
  
      // Conditionally add extra fields based on statut
      if (savedPersonnel.statut === PersonnelStatut.ABSENT) {
        createPresenceDto.justifie = false;
        createPresenceDto.motif = 'Absent without justification';
      }
  
      if (savedPersonnel.statut === PersonnelStatut.CONGE) {
        console.log("la conition est correcte")
        createPresenceDto.debut = new Date(); // Adjust the logic here if needed
        createPresenceDto.fin = new Date();   // Adjust the logic here if needed
        createPresenceDto.type=CongeType.MALADIE
      }
  
      // Validate presence data (if necessary)
      if (!createPresenceDto.date || !createPresenceDto.statut) {
        throw new NotFoundException();
      }
      console.log(createPresenceDto)
      // Call your create method in PresencesService
      await this.presencesService.create(createPresenceDto);
  
      return savedPersonnel;
    } catch (error) {
      console.error(error);
      throw new ConflictException("Cannot create personnel due to an error.");
    }
  }
  
  

  async findAll() {
    return await this.personnelsRepository.find();
  }


  async findOne(id: number) {
    console.log(id)
    const personnel = await this.personnelsRepository.findOne({ where: { id } });
    if (!personnel) {
      throw new NotFoundException('Personnel not found');
    }
    return personnel;
  }


  async update(id: number, updatePersonnelDto: UpdatePersonnelDto): Promise<Personnel> {
    const personnel = await this.findOne(id);
    if (!personnel) {
      throw new NotFoundException('Personnel not found');
    }

    // Apply the updates to the personnel
    Object.assign(personnel, updatePersonnelDto);

    // Save the updated personnel
    const updatedPersonnel = await this.personnelsRepository.save(personnel);

    // Check the statut and create or update a Presence if necessary
    const createPresenceDto: CreatePresenceDto = {
      date: new Date(),
      statut: updatedPersonnel.statut,
      personnelId: updatedPersonnel.id,
      // Add additional fields based on the statut
      ...(updatedPersonnel.statut === PersonnelStatut.ABSENT && { justifie: false, motif: 'Absent without justification' }),
      ...(updatedPersonnel.statut === PersonnelStatut.CONGE && { debut: new Date(), fin: new Date() }),
      // Add other statuts like MISSION and CONGE if needed
    };

    // Update or create a Presence based on the statut change
    await this.presencesService.create(createPresenceDto);

    return updatedPersonnel;
  }

  async remove(id: number): Promise<Personnel> {
    const personnel = await this.findOne(id);
    if (!personnel) {
      throw new NotFoundException('Personnel not found');
    }

    // Remove the personnel from the database
    return await this.personnelsRepository.remove(personnel);
  }
}

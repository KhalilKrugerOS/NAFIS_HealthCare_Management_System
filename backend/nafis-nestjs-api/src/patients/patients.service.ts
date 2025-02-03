import { ConflictException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Patient } from './entities/patient.entity';
import { In, Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { Consultation } from 'src/consultations/entities/consultation.entity';
import { Document } from 'src/documents/entities/document.entity';
import { ConsultationsService } from 'src/consultations/consultations.service';
import { DocumentsService } from 'src/documents/documents.service';
@Injectable()
export class PatientsService {

  constructor(
    @InjectRepository(Patient)
    private readonly patientsRepository: Repository<Patient>,
    @Inject(forwardRef(() => UserService)) // Use forwardRef to prevent circular dependency
        private readonly userService: UserService,
        @Inject(forwardRef(() => ConsultationsService)) // Use forwardRef if there is a circular dependency
        private readonly consultationsService: ConsultationsService,
        @Inject(forwardRef(() => DocumentsService)) // Use forwardRef if there is a circular dependency
        private readonly documentsService: DocumentsService,
     
      ) {
  }
 async create(userId: number, newPatientdata: CreatePatientDto): Promise<Patient> {
     try {
       // Verify that the user exists
       const user = await this.userService.findOne(userId);
       if (!user) {
         throw new NotFoundException(`User with ID ${userId} not found`);
       }
   
       // Create the admin entity
       const newPatient = this.patientsRepository.create({
         ...newPatientdata,
         user, // Assign the actual user entity instead of just { id: userId }
       });
       console.log("this is the patient",newPatient)
   
       // Save the admin entity
       return await this.patientsRepository.save(newPatient);
     } catch (error) {
       console.error(error);
       throw new ConflictException("Cannot create admin");
     }
   }

  async findAll() {
    return await this.patientsRepository.find();
  }

  async findOne(id: number) {
    return await this.patientsRepository.findOne({where:{id}});
  }

  async update(id: number, updatePatientDto: UpdatePatientDto) {
    const patient=await this.findOne(id);
    if(!patient){
      throw new NotFoundException();
    }
    Object.assign(patient,UpdatePatientDto);
    return await this.patientsRepository.save(patient);
  }

  async remove(id: number) {
    const patient=await this.findOne(id);
    if(!patient){
      throw new NotFoundException();
    }
    return await this.patientsRepository.remove(patient);
  }
  async findPatientHistory(patientId: number) {
    // Find the patient first
    const patient = await this.patientsRepository.findOne({ where: { id: patientId } });
  
    if (!patient) {
      throw new NotFoundException(`Patient with id ${patientId} not found`);
    }
  
    // Manually fetch the related documents and consultations
    const documents = await this.documentsService.findPatientDocuments(patientId)
   const consultations = await this.consultationsService.findByPatientId(patientId)
  
    // Return the patient with its related documents and consultations
    return {
      patient,
      documents,
      consultations,
    };
  }
  
  async findByIds(ids: number[]): Promise<Patient[]> {
    return await this.patientsRepository.findBy({
      id: In(ids), // Use the `In` operator to filter by a list of IDs
    });
  }
}

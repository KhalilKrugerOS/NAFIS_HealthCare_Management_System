import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SignupDto } from 'src/auth/dto/signup.dto';
import { AdminService } from 'src/admin/admin.service'; // Import AdminService
import { UserRoleEnum } from 'src/enums/user-role.enum';
import { PatientsService } from 'src/patients/patients.service';
import { PersonnelsService } from 'src/personnels/personnels.service';
import { PersonnelCategorie, PersonnelStatut, PersonnelType, Specialite } from 'src/personnels/entities/personnel.entity';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly adminService: AdminService, // Inject AdminService
    private readonly patientService: PatientsService, // Inject PatientService
    private readonly personnelService: PersonnelsService,
  ) {}

  async add(s: SignupDto) {
    // Create a new user
    const userEntity = this.userRepository.create(s);
    const savedUser = await this.userRepository.save(userEntity);

    // Check user role and create corresponding entity
    switch (savedUser.role) {
      case UserRoleEnum.ADMIN:
        await this.adminService.create([savedUser.id], {
          firstname: '', // Provide the necessary data for admin
          lastname: '',
          email: '',
          password: '',
          role: UserRoleEnum.ADMIN, // Ensure role is set appropriately
        });
        break;
      
      case UserRoleEnum.PATIENT:
        await this.patientService.create(savedUser.id, {firstname:'',lastname:'',email:'',password:'',role:UserRoleEnum.PATIENT
        });
        break;
      
      case UserRoleEnum.DOCTOR:
        await this.personnelService.create(savedUser.id, {
          firstname: '',
          lastname: '',
          email: '',
          password: '',
          role: UserRoleEnum.DOCTOR,
          type: PersonnelType.MEDECIN, // Explicitly set the type
          categorie:PersonnelCategorie.RESIDENT,
          specialite:Specialite.CHIRURGIE,
          service:'service1',
          matricule:"",
          dateRecrutement:new Date("2025-06-06")
        });
        break;
      
      default:
        throw new NotFoundException('Invalid role');
    }

    return savedUser;
  }

  async save(s: User) {
    if (s) {
      return await this.userRepository.save(s);
    } else {
      throw new NotFoundException();
    }
  }

  async findOne(id: number) {
    return await this.userRepository.findOne({ where: { id: id } })
  }

 async findByEmail(email: string) {
    return await this.userRepository.findOne({ where: { email: email } });
  }
   async findAll() {
    return this.userRepository.find(); // This will return all users
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
  
}

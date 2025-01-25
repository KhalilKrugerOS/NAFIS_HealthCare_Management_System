import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from './entities/admin.entity';
import { CreateAdminDto } from './dto/create-admin.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
  ) {}

  async create(createAdminDto: CreateAdminDto): Promise<Admin> {
    // Hash the password from the DTO
    const hashedPassword = await bcrypt.hash(createAdminDto.password, 10);

    // Create an admin without the password field in the entity
    const admin = this.adminRepository.create({
      ...createAdminDto, // Spread other fields from the DTO
      // Do not add password field to the entity
    });

    // You can add the hashed password to an authentication system later, but don't store it in the entity.

    // Save the admin without the password field in the database
    const savedAdmin = await this.adminRepository.save(admin);

    return savedAdmin;
  }

  async findAll(): Promise<Admin[]> {
    return this.adminRepository.find();
  }

  async findOne(id: number): Promise<Admin> {
    return this.adminRepository.findOne({ where: { id } });
  }
}

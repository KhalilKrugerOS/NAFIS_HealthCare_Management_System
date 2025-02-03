/* eslint-disable prettier/prettier */
import { ConflictException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from './entities/admin.entity';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
    @Inject(forwardRef(() => UserService)) // Prevent circular dependency
    private readonly userService: UserService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  /**
   * Create an Admin and associate it with users.
   */
  async create(userIds: number[], newAdminData: CreateAdminDto): Promise<Admin> {
    try {
      // Fetch users from the database
      const users = await this.userRepository.findByIds(userIds);
      if (users.length !== userIds.length) {
        throw new NotFoundException(`One or more users not found`);
      }

      // Create a new admin and assign the users
      const newAdmin = this.adminRepository.create({
        ...newAdminData,
        users, // Associate multiple users with this admin
      });

      // Save admin entity
      return await this.adminRepository.save(newAdmin);
    } catch (error) {
      console.error(error);
      throw new ConflictException("Cannot create admin");
    }
  }

  /**
   * Fetch all admins with their users.
   */
  async findAll(): Promise<Admin[]> {
    return this.adminRepository.find({ relations: ['users'] });
  }

  /**
   * Find an admin by ID with their associated users.
   */
  async findOne(id: number): Promise<Admin> {
    const admin = await this.adminRepository.findOne({
      where: { id },
      relations: ['users'],
    });

    if (!admin) {
      throw new NotFoundException(`Admin with ID ${id} not found`);
    }
    return admin;
  }

  /**
   * Find an appropriate admin (optional: based on assigned users)
   */
  async findAppropriateAdmin(): Promise<Admin> {
    const admin = await this.adminRepository
      .createQueryBuilder('admin')
      .leftJoinAndSelect('admin.users', 'user') // Use 'users' instead of 'patients'
      .having('COUNT(user.id) < 10') // Example condition: assign if <10 users
      .orderBy('admin.createdAt', 'ASC')
      .getOne();

    return admin;
  }

  /**
   * Assign users to an existing admin.
   */
  async assignUsers(adminId: number, userIds: number[]): Promise<Admin> {
    const admin = await this.findOne(adminId);
    const users = await this.userRepository.findByIds(userIds);

    if (users.length !== userIds.length) {
      throw new NotFoundException(`One or more users not found`);
    }

    admin.users = [...admin.users, ...users];
    return this.adminRepository.save(admin);
  }
}

import { SetMetadata } from '@nestjs/common';
import { UserRoleEnum } from 'src/enums/user-role.enum';
import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { RoleAccessControlGuard } from 'src/guards/roles.guard';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRoleEnum[]) => SetMetadata(ROLES_KEY, roles);

@Controller('admins')
@UseGuards(RoleAccessControlGuard)
@Roles(UserRoleEnum.ADMIN)  // This will apply to all routes in this controller
export class AdminController {
    constructor(private readonly adminService: AdminService) {}

    @Get()
    async findAll() {
        return this.adminService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: number) {
        return this.adminService.findOne(id);
    }
}
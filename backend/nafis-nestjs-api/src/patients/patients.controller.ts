/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  //Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { PatientsService } from "./patients.service";
import { UpdatePatientDto } from "./dto/update-patient.dto";

import { UseGuards } from "@nestjs/common";
import { RoleAccessControlGuard } from "src/guards/roles.guard";
import { ConsultationsService } from "src/consultations/consultations.service";
import { UserRoleEnum } from "src/enums/user-role.enum";
import { Roles } from "src/decorators/roles";
import { CurrentUser } from "src/decorators/current-user";
@Controller("patients")
@UseGuards(RoleAccessControlGuard)
export class PatientsController {
  constructor(
    private readonly patientsService: PatientsService,
    private readonly consultationService: ConsultationsService
  ) {}

  @Get('by-doctor')
  @Roles(UserRoleEnum.PERSONNEL)
  async findPatientsByDoctor(@CurrentUser() user: any) {
    const doctorId = user.id;
    return await this.consultationService.findPatientsByDoctor(doctorId);
  }

  @Get()
  async findAll() {
    return await this.patientsService.findAll();
  }

  @Get(":id")
  async findOne(@Param("id") id: number) {
    return await this.patientsService.findOne(id);
  }

  @Patch(":id")
  async update(
    @Param("id") id: number,
    @Body() updatePatientDto: UpdatePatientDto
  ) {
    return await this.patientsService.update(+id, updatePatientDto);
  }

  @Delete(":id")
  async remove(@Param("id") id: number) {
    return await this.patientsService.remove(+id);
  }
  @Get(":patientId/historique")
  async findPatientHistory(@Param("patientId") patientId: number) {
    return await this.patientsService.findPatientHistory(patientId);
  }
}

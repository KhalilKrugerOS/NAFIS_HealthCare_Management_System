import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';

import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/jwt-auth.guard';
@Controller('patients')
@UseGuards(AuthGuard)
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}



  @Get()
  
  findAll() {
    return this.patientsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.patientsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePatientDto: UpdatePatientDto) {
    return this.patientsService.update(+id, updatePatientDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.patientsService.remove(+id);
  }
  @Get(':patientId/historique')
  async findPatientHistory(@Param('patientId') patientId: string) {
    return this.patientsService.findPatientHistory(+patientId);
  }
}

import { Module } from '@nestjs/common';
import { CitasController } from './citas.controller';
import { CitasService } from './citas.service';
import { IntegracionCitasHospitalService } from './services/integracion-citas-hospital.service';
import { PacientesModule } from '../pacientes/pacientes.module';

@Module({
  imports: [PacientesModule],
  controllers: [CitasController],
  providers: [CitasService, IntegracionCitasHospitalService],
  exports: [CitasService, IntegracionCitasHospitalService],
})
export class CitasModule {}

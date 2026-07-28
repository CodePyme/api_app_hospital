import { PartialType } from '@nestjs/mapped-types';
import { CrearPacienteDto } from './crear-paciente.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { EstadoPaciente } from '../entities/paciente.entity';

export class ActualizarPacienteDto extends PartialType(CrearPacienteDto) {
  @IsOptional()
  @IsEnum(EstadoPaciente, { message: 'El estado debe ser: activo o inactivo' })
  estado?: EstadoPaciente;
}

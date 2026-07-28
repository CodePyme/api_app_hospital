import { PartialType } from '@nestjs/mapped-types';
import { CrearCitaDto } from './crear-cita.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { EstadoCita } from '../entities/cita.entity';

export class ActualizarCitaDto extends PartialType(CrearCitaDto) {
  @IsOptional()
  @IsEnum(EstadoCita, { message: 'El estado de la cita no es válido' })
  estado?: EstadoCita;
}

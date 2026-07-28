import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
} from 'class-validator';
import { TipoCita } from '../entities/cita.entity';

export class CrearCitaDto {
  @IsNotEmpty({ message: 'El ID del paciente es requerido' })
  @IsUUID('4', { message: 'El ID del paciente debe ser un UUID válido' })
  pacienteId: string;

  @IsNotEmpty({ message: 'La fecha de la cita es requerida' })
  @IsDateString({}, { message: 'La fecha de la cita debe ser una fecha válida (YYYY-MM-DD)' })
  fechaCita: string;

  @IsNotEmpty({ message: 'La hora de inicio es requerida' })
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'La hora de inicio debe tener formato HH:MM' })
  horaInicio: string;

  @IsNotEmpty({ message: 'La hora de fin es requerida' })
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'La hora de fin debe tener formato HH:MM' })
  horaFin: string;

  @IsOptional()
  @IsEnum(TipoCita, { message: 'El tipo de cita no es válido' })
  tipoCita?: TipoCita;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  medicoResponsable?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  especialidad?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  consultorio?: string;

  @IsOptional()
  @IsString()
  motivoConsulta?: string;

  @IsOptional()
  @IsString()
  observaciones?: string;
}

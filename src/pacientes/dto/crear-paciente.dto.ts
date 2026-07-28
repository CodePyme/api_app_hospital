import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { GeneroPaciente } from '../entities/paciente.entity';

export class CrearPacienteDto {
  @IsNotEmpty({ message: 'Los nombres son requeridos' })
  @IsString({ message: 'Los nombres deben ser texto' })
  @MaxLength(100, { message: 'Los nombres no pueden superar 100 caracteres' })
  nombres: string;

  @IsNotEmpty({ message: 'Los apellidos son requeridos' })
  @IsString({ message: 'Los apellidos deben ser texto' })
  @MaxLength(100, { message: 'Los apellidos no pueden superar 100 caracteres' })
  apellidos: string;

  @IsNotEmpty({ message: 'El número de documento es requerido' })
  @IsString()
  @MaxLength(20)
  numeroDocumento: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  tipoDocumento?: string;

  @IsNotEmpty({ message: 'La fecha de nacimiento es requerida' })
  @IsDateString({}, { message: 'La fecha de nacimiento debe ser una fecha válida (YYYY-MM-DD)' })
  fechaNacimiento: string;

  @IsOptional()
  @IsEnum(GeneroPaciente, { message: 'El género debe ser: masculino, femenino u otro' })
  genero?: GeneroPaciente;

  @IsOptional()
  @IsEmail({}, { message: 'El correo electrónico no es válido' })
  @MaxLength(150)
  correoElectronico?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  telefono?: string;

  @IsOptional()
  @IsString()
  direccion?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  ciudad?: string;

  @IsOptional()
  @IsString()
  observaciones?: string;
}

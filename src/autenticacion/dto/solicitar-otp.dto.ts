import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SolicitarOtpDto {
  @IsNotEmpty({ message: 'El tipo de documento es requerido' })
  @IsString({ message: 'El tipo de documento debe ser una cadena de texto' })
  tipoDocumento: string;

  @IsNotEmpty({ message: 'El número de documento es requerido' })
  @IsString({ message: 'El número de documento debe ser una cadena de texto' })
  numeroDocumento: string;

  @IsNotEmpty({ message: 'La fecha de nacimiento es requerida' })
  @IsString({ message: 'La fecha de nacimiento debe ser una fecha válida' })
  fechaNacimiento: string;

  @IsOptional()
  @IsBoolean({ message: 'La aceptación de tratamiento de datos debe ser un valor booleano' })
  aceptaTratamientoDatos?: boolean;
}

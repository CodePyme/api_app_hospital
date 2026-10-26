import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegistrarUsuarioDto {
  @IsNotEmpty({ message: 'Los nombres son requeridos' })
  @IsString()
  @MaxLength(100)
  nombres: string;

  @IsNotEmpty({ message: 'Los apellidos son requeridos' })
  @IsString()
  @MaxLength(100)
  apellidos: string;

  @IsNotEmpty({ message: 'El correo electrónico es requerido' })
  @IsEmail({}, { message: 'El correo electrónico no es válido' })
  @MaxLength(150)
  correoElectronico: string;

  @IsNotEmpty({ message: 'La contraseña es requerida' })
  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  contrasena: string;
}

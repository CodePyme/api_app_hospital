import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';

export class CrearUsuarioDto {
  @IsString()
  @IsNotEmpty()
  nombres: string;

  @IsString()
  @IsNotEmpty()
  apellidos: string;

  @IsEmail()
  @IsNotEmpty()
  correoElectronico: string;

  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  contrasena: string;

  @IsUUID('4', { message: 'El rol seleccionado no es válido' })
  @IsNotEmpty({ message: 'Debes seleccionar un rol para el usuario' })
  rolId: string;

  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  permisoIds?: string[];

  @IsBoolean()
  @IsOptional()
  activo?: boolean;
}

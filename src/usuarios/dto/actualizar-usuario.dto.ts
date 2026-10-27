import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';

export class ActualizarUsuarioDto {
  @IsString()
  @IsOptional()
  nombres?: string;

  @IsString()
  @IsOptional()
  apellidos?: string;

  @IsEmail()
  @IsOptional()
  correoElectronico?: string;

  @IsString()
  @IsOptional()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  contrasena?: string;

  @IsUUID('4', { message: 'El rol seleccionado no es válido' })
  @IsOptional()
  rolId?: string;

  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  permisoIds?: string[];

  @IsBoolean()
  @IsOptional()
  activo?: boolean;
}

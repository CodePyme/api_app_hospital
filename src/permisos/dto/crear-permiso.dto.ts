import { IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CrearPermisoDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  codigo: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombre: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  descripcion?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  modulo: string;

  @IsBoolean()
  @IsOptional()
  activo?: boolean;
}

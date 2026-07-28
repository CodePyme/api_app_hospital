import {
  IsString,
  IsNotEmpty,
  IsInt,
  IsOptional,
  IsBoolean,
  Min,
  Max,
  Length,
  Matches,
} from 'class-validator';

export class CrearTenantDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @Length(2, 100, { message: 'El nombre debe tener entre 2 y 100 caracteres' })
  nombre: string;

  @IsString()
  @IsNotEmpty({ message: 'El dominio es requerido' })
  @Length(3, 255, { message: 'El dominio debe tener entre 3 y 255 caracteres' })
  @Matches(/^[a-z0-9][a-z0-9\-\.]*[a-z0-9]$|^localhost$/, {
    message: 'El dominio debe ser válido (ej: clinica-abc.com o localhost)',
  })
  dominio: string;

  @IsString()
  @IsNotEmpty({ message: 'El slug es requerido' })
  @Length(2, 100)
  @Matches(/^[a-z0-9\-]+$/, {
    message: 'El slug solo puede contener letras minúsculas, números y guiones',
  })
  slug: string;

  @IsString()
  @IsNotEmpty({ message: 'El host de la BD es requerido' })
  dbHost: string;

  @IsInt()
  @Min(1)
  @Max(65535)
  dbPort: number;

  @IsString()
  @IsNotEmpty({ message: 'El usuario de la BD es requerido' })
  dbUsername: string;

  @IsString()
  @IsNotEmpty({ message: 'La contraseña de la BD es requerida' })
  dbPassword: string;

  @IsString()
  @IsNotEmpty({ message: 'El nombre de la BD es requerido' })
  @Matches(/^[a-z0-9_]+$/, {
    message: 'El nombre de la BD solo puede contener letras minúsculas, números y guiones bajos',
  })
  dbDatabase: string;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}

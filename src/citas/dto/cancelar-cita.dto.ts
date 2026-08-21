import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CancelarCitaDto {
  @IsString()
  @IsNotEmpty({ message: 'El identificador de la cita (IdCita) es requerido' })
  idCita: string;

  @IsString()
  @IsNotEmpty({ message: 'El motivo de cancelación (IdMotivo) es requerido' })
  idMotivo: string;

  @IsString()
  @IsOptional()
  observaciones?: string;

  @IsOptional()
  datosCita?: Record<string, any>;
}

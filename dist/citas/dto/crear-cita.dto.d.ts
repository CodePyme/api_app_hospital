import { TipoCita } from '../entities/cita.entity';
export declare class CrearCitaDto {
    pacienteId: string;
    fechaCita: string;
    horaInicio: string;
    horaFin: string;
    tipoCita?: TipoCita;
    medicoResponsable?: string;
    especialidad?: string;
    consultorio?: string;
    motivoConsulta?: string;
    observaciones?: string;
}

import { Paciente } from '../../pacientes/entities/paciente.entity';
export declare enum EstadoCita {
    PROGRAMADA = "programada",
    CONFIRMADA = "confirmada",
    EN_ATENCION = "en_atencion",
    COMPLETADA = "completada",
    CANCELADA = "cancelada",
    NO_ASISTIO = "no_asistio"
}
export declare enum TipoCita {
    CONSULTA_GENERAL = "consulta_general",
    ESPECIALISTA = "especialista",
    URGENCIAS = "urgencias",
    CONTROL = "control",
    PROCEDIMIENTO = "procedimiento"
}
export declare class Cita {
    id: string;
    pacienteId: string;
    paciente: Paciente;
    fechaCita: Date;
    horaInicio: string;
    horaFin: string;
    tipoCita: TipoCita;
    estado: EstadoCita;
    medicoResponsable: string;
    especialidad: string;
    consultorio: string;
    motivoConsulta: string;
    observaciones: string;
    creadoEn: Date;
    actualizadoEn: Date;
}

export declare class AuditoriaCancelacionCita {
    id: string;
    idCita: string;
    pacienteId?: string;
    usuarioId?: string;
    numeroDocumento: string;
    tipoDocumento: string;
    nombrePaciente?: string;
    idMotivo: string;
    descripcionMotivo: string;
    observaciones?: string;
    limiteHoras: number;
    codigoRespuestaSap?: string;
    mensajeRespuestaSap?: string;
    exitosa: boolean;
    ipUsuario?: string;
    userAgent?: string;
    datosCita?: Record<string, any>;
    creadoEn: Date;
}

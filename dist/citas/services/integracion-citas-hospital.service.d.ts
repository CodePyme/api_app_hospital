import { ConfigService } from '@nestjs/config';
export interface DetalleCitaSap {
    idCita: string;
    fecha: string;
    hora: string;
    modoAtencion: string;
    ubicacion: string;
    idUnidadEdificio?: string;
    descUnidadEdificio?: string;
    unidadTratamiento?: string;
    tipoPlanificacion?: string;
    especialidad: string;
    medicoTratante: string;
    aseguradora?: string;
    estado?: string;
}
export interface RespuestaAgendaSap {
    idMessage: string;
    message: string;
    paciente?: {
        tipoDocumento: string;
        numeroDocumento: string;
        nombreCompleto: string;
        sexo?: string;
    };
    citas: DetalleCitaSap[];
}
export interface RespuestaCancelacionSap {
    idMessage: string;
    message: string;
    exitosa: boolean;
}
export declare class IntegracionCitasHospitalService {
    private readonly configService;
    private readonly logger;
    constructor(configService: ConfigService);
    private normalizarTipoDocumento;
    private getEndpointAgenda;
    private getEndpointCancelarCita;
    consultarAgendaPaciente(parametros: {
        tipoDocumento: string;
        numeroDocumento: string;
    }): Promise<RespuestaAgendaSap>;
    cancelarCitaSAP(parametros: {
        idCita: string;
        idMotivo: string;
        limiteHoras?: number;
    }): Promise<RespuestaCancelacionSap>;
    private mapearRespuestaAgenda;
}

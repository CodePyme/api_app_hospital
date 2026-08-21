import { ConfigService } from '@nestjs/config';
export interface DatosDemograficosPaciente {
    numeroPaciente?: string;
    nombres: string;
    apellidos: string;
    nombreCompleto: string;
    tipoDocumento: string;
    descDocumento?: string;
    numeroDocumento: string;
    fechaNacimiento: string;
    edad?: string;
    sexo?: string;
    correoElectronico: string;
    telefono?: string;
    direccion?: string;
    ciudad?: string;
    departamento?: string;
    pais?: string;
    direccionCompleta?: string;
    genero?: string;
}
export declare class IntegracionHospitalService {
    private readonly configService;
    private readonly logger;
    constructor(configService: ConfigService);
    private normalizarTipoDocumento;
    private normalizarFecha;
    private getEndpointDemograficos;
    consultarDatosDemograficos(parametros: {
        tipoDocumento: string;
        numeroDocumento: string;
        fechaNacimiento: string;
    }): Promise<DatosDemograficosPaciente | null>;
    consultarPorEpisodio(parametros: {
        episodio: string;
        centroSanitario?: string;
    }): Promise<DatosDemograficosPaciente | null>;
    private mapearRespuestaDemograficos;
}

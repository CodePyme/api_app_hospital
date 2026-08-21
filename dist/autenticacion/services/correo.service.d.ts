import { ConfigService } from '@nestjs/config';
export interface ParametrosCorreoOtp {
    destinatario: string;
    nombrePaciente: string;
    codigoOtp: string;
    minutosValidez?: number;
    nombreEntidad?: string;
    logoUrl?: string;
    colorPrimario?: string;
    colorSecundario?: string;
}
export declare class CorreoService {
    private readonly configService;
    private readonly logger;
    private transporter;
    constructor(configService: ConfigService);
    private inicializarTransporter;
    enviarCodigoOtp(parametros: ParametrosCorreoOtp): Promise<boolean>;
    private generarPlantillaOtp;
}

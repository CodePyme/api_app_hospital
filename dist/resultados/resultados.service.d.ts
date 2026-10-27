import { ConfigService } from '@nestjs/config';
import type { Request, Response } from 'express';
export interface FiltroLabcore {
    Property: string;
    Operator: string;
    Value: string;
}
export declare class ResultadosService {
    private readonly request;
    private readonly configService;
    private readonly logger;
    static readonly MENSAJE_CONFIDENCIAL = "EL RESULTADO EST\u00C1 LISTO PERO DEBE RECLAMARSE DE FORMA PRESENCIAL EN LA INSTITUCI\u00D3N";
    private static readonly PATRONES_CONFIDENCIALES;
    static esConfidencial(texto: string): boolean;
    private static tokenCache;
    constructor(request: Request, configService: ConfigService);
    private get baseApiUrl();
    private get login();
    private get password();
    private get timeoutMs();
    autenticar(): Promise<{
        authKey: string;
        cookie: string;
    }>;
    private obtenerHeadersPeticion;
    obtenerOrdenesLaboratorio(usuario: any, query: any): Promise<{
        exito: boolean;
        mensaje: string;
        datos: any;
        totalRegistros: any;
        status: any;
    }>;
    obtenerDetalleOrden(internalNumber: string, clientCode?: string, usuario?: any): Promise<{
        exito: boolean;
        mensaje: string;
        datos: any;
        status: any;
    }>;
    proxyPdf(pdfUrlKey: string, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    private ordenPerteneceAlPaciente;
}

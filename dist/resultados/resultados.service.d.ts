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
    private static tokenCache;
    constructor(request: Request, configService: ConfigService);
    private get baseApiUrl();
    private get login();
    private get password();
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
    obtenerDetalleOrden(internalNumber: string, clientCode?: string): Promise<{
        exito: boolean;
        mensaje: string;
        datos: any;
        status: any;
    }>;
    proxyPdf(pdfUrlKey: string, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}

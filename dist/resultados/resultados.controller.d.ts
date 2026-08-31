import type { Request, Response } from 'express';
import { ResultadosService } from './resultados.service';
export declare class ResultadosController {
    private readonly resultadosService;
    constructor(resultadosService: ResultadosService);
    obtenerOrdenesLaboratorio(req: Request, pagina?: string, limite?: string, clientCode?: string): Promise<{
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
    descargarPdf(pdfUrl: string, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}

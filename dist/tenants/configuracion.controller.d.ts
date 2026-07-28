import { TenantService } from './tenant.service';
export declare class ConfiguracionController {
    private readonly tenantService;
    constructor(tenantService: TenantService);
    obtenerConfiguracion(req: any): Promise<{
        exito: boolean;
        mensaje: string;
        datos: {
            nombreEntidad: any;
            logoUrl: any;
            colorPrimario: any;
            colorSecundario: any;
        };
    }>;
    actualizarConfiguracion(req: any, body: {
        nombreEntidad?: string;
        logoUrl?: string;
        colorPrimario?: string;
        colorSecundario?: string;
    }): Promise<{
        exito: boolean;
        mensaje: string;
        datos?: undefined;
    } | {
        exito: boolean;
        mensaje: string;
        datos: {
            nombreEntidad: string;
            logoUrl: string;
            colorPrimario: string;
            colorSecundario: string;
        };
    }>;
}

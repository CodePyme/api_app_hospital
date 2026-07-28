import { TenantService } from './tenant.service';
import { CrearTenantDto } from './dto/crear-tenant.dto';
import { ActualizarTenantDto } from './dto/actualizar-tenant.dto';
export declare class TenantController {
    private readonly tenantService;
    constructor(tenantService: TenantService);
    obtenerTodos(pagina?: number, limite?: number): Promise<import("../common/interfaces/respuesta-api.interface").RespuestaPaginada<import("./tenant.entity").Tenant>>;
    obtenerPorId(id: string): Promise<import("../common/interfaces/respuesta-api.interface").RespuestaApi<import("./tenant.entity").Tenant>>;
    crear(crearTenantDto: CrearTenantDto): Promise<import("../common/interfaces/respuesta-api.interface").RespuestaApi<import("./tenant.entity").Tenant>>;
    actualizar(id: string, actualizarTenantDto: ActualizarTenantDto): Promise<import("../common/interfaces/respuesta-api.interface").RespuestaApi<import("./tenant.entity").Tenant>>;
    toggleActivo(id: string): Promise<import("../common/interfaces/respuesta-api.interface").RespuestaApi<import("./tenant.entity").Tenant>>;
    eliminar(id: string): Promise<import("../common/interfaces/respuesta-api.interface").RespuestaApi<null>>;
}

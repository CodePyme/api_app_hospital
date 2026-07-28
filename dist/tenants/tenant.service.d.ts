import { Repository } from 'typeorm';
import { Tenant } from './tenant.entity';
import { CrearTenantDto } from './dto/crear-tenant.dto';
import { ActualizarTenantDto } from './dto/actualizar-tenant.dto';
import { RespuestaApi, RespuestaPaginada } from '../common/interfaces/respuesta-api.interface';
export declare class TenantService {
    private readonly repositorioTenant;
    private readonly logger;
    constructor(repositorioTenant: Repository<Tenant>);
    crearTenant(crearTenantDto: CrearTenantDto): Promise<RespuestaApi<Tenant>>;
    obtenerTodosTenants(pagina?: number, limite?: number): Promise<RespuestaPaginada<Tenant>>;
    obtenerTenantPorId(id: string): Promise<RespuestaApi<Tenant>>;
    buscarPorDominio(dominio: string): Promise<Tenant | null>;
    actualizarTenant(id: string, actualizarTenantDto: ActualizarTenantDto): Promise<RespuestaApi<Tenant>>;
    toggleActivo(id: string): Promise<RespuestaApi<Tenant>>;
    eliminarTenant(id: string): Promise<RespuestaApi<null>>;
    actualizarBranding(id: string, branding: {
        nombreEntidad?: string;
        logoUrl?: string;
        colorPrimario?: string;
        colorSecundario?: string;
    }): Promise<Tenant>;
}

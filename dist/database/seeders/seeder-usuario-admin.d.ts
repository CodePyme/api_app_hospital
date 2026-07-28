import { OnApplicationBootstrap } from '@nestjs/common';
import { TenantService } from '../../tenants/tenant.service';
import { TenantConnectionManager } from '../../tenants/tenant-connection.manager';
export declare class SeederUsuarioAdmin implements OnApplicationBootstrap {
    private readonly tenantService;
    private readonly connectionManager;
    private readonly logger;
    private readonly CORREO_ADMIN;
    private readonly CONTRASENA_ADMIN;
    private readonly RONDAS_HASH;
    constructor(tenantService: TenantService, connectionManager: TenantConnectionManager);
    onApplicationBootstrap(): Promise<void>;
    private sembrarUsuarioAdmin;
}

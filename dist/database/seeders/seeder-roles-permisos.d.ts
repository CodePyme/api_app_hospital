import { OnApplicationBootstrap } from '@nestjs/common';
import { TenantService } from '../../tenants/tenant.service';
import { TenantConnectionManager } from '../../tenants/tenant-connection.manager';
export declare class SeederRolesPermisos implements OnApplicationBootstrap {
    private readonly tenantService;
    private readonly connectionManager;
    private readonly logger;
    constructor(tenantService: TenantService, connectionManager: TenantConnectionManager);
    onApplicationBootstrap(): Promise<void>;
    private sembrarRolesYPermisos;
}

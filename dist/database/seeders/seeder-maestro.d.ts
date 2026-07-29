import { OnApplicationBootstrap } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Tenant } from '../../tenants/tenant.entity';
import { TenantConnectionManager } from '../../tenants/tenant-connection.manager';
export declare class SeederMaestro implements OnApplicationBootstrap {
    private readonly repositorioTenant;
    private readonly connectionManager;
    private readonly logger;
    constructor(repositorioTenant: Repository<Tenant>, connectionManager: TenantConnectionManager);
    onApplicationBootstrap(): Promise<void>;
    private garantizarTenantDesarrollo;
}

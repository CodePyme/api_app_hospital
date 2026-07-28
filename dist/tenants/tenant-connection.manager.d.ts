import { OnModuleDestroy } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Tenant } from './tenant.entity';
export declare class TenantConnectionManager implements OnModuleDestroy {
    private readonly logger;
    private readonly conexiones;
    obtenerConexion(tenant: Tenant): Promise<DataSource>;
    onModuleDestroy(): Promise<void>;
    cerrarConexion(dominio: string): Promise<void>;
    get totalConexionesActivas(): number;
}

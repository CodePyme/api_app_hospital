import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { TenantService } from './tenant.service';
import { TenantConnectionManager } from './tenant-connection.manager';
import { DataSource } from 'typeorm';
declare global {
    namespace Express {
        interface Request {
            tenantDominio?: string;
            tenantConexion?: DataSource;
            tenant?: any;
        }
    }
}
export declare class TenantMiddleware implements NestMiddleware {
    private readonly tenantService;
    private readonly connectionManager;
    private readonly logger;
    constructor(tenantService: TenantService, connectionManager: TenantConnectionManager);
    use(req: Request, res: Response, next: NextFunction): Promise<void>;
}

import {
  Injectable,
  NestMiddleware,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { TenantService } from './tenant.service';
import { TenantConnectionManager } from './tenant-connection.manager';
import { DataSource } from 'typeorm';

// Extensión de la interfaz Request de Express para incluir datos del tenant
declare global {
  namespace Express {
    interface Request {
      tenantDominio?: string;
      tenantConexion?: DataSource;
      tenant?: any;
    }
  }
}

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  private readonly logger = new Logger(TenantMiddleware.name);

  constructor(
    private readonly tenantService: TenantService,
    private readonly connectionManager: TenantConnectionManager,
  ) {}

  async use(req: Request, res: Response, next: NextFunction): Promise<void> {
    // Resolver el dominio del tenant:
    // 1. Header X-Tenant-Domain (para desarrollo/testing local)
    // 2. Header Host (producción)
    const dominioRaw =
      (req.headers['x-tenant-domain'] as string) ||
      (req.headers['host'] as string) ||
      '';

    // Limpiar puerto del dominio (ej: "localhost:3000" → "localhost")
    const dominio = dominioRaw.split(':')[0].toLowerCase().trim();

    if (!dominio) {
      throw new NotFoundException('No se pudo determinar el tenant: dominio no proporcionado');
    }

    this.logger.debug(`🏢 Resolviendo tenant para dominio: ${dominio}`);

    // Buscar el tenant en la base de datos maestra
    const tenant = await this.tenantService.buscarPorDominio(dominio);

    if (!tenant) {
      throw new NotFoundException(
        `Tenant no encontrado para el dominio: ${dominio}`,
      );
    }

    if (!tenant.activo) {
      throw new NotFoundException(`El tenant para el dominio ${dominio} está inactivo`);
    }

    // Obtener o crear la conexión del tenant
    const conexion = await this.connectionManager.obtenerConexion(tenant);

    // Adjuntar al request para uso posterior en servicios/guards
    req.tenantDominio = dominio;
    req.tenantConexion = conexion;
    req.tenant = tenant;

    next();
  }
}

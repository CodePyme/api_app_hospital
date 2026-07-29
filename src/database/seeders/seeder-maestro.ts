import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tenant } from '../../tenants/tenant.entity';
import { TenantConnectionManager } from '../../tenants/tenant-connection.manager';

/**
 * SeederMaestro — se ejecuta en cada arranque de la aplicación.
 *
 * Responsabilidades:
 *  1. Garantizar que el tenant de desarrollo exista en la BD maestra.
 *  2. Abrir la conexión al tenant para que TypeORM (synchronize: true)
 *     cree o actualice todas las tablas del tenant automáticamente.
 *
 * Al completar, SeederUsuarioAdmin (que se registra después) puede
 * encontrar el tenant y sembrar el usuario administrador.
 */
@Injectable()
export class SeederMaestro implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeederMaestro.name);

  constructor(
    @InjectRepository(Tenant)
    private readonly repositorioTenant: Repository<Tenant>,
    private readonly connectionManager: TenantConnectionManager,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    await this.garantizarTenantDesarrollo();
  }

  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Crea (o verifica) el tenant de desarrollo y establece su conexión
   * para que las tablas del tenant queden creadas/sincronizadas.
   */
  private async garantizarTenantDesarrollo(): Promise<void> {
    try {
      const dominio = process.env.TENANT_DEV_DOMINIO ?? 'localhost';

      // 1. Verificar si ya existe el tenant de desarrollo
      let tenant = await this.repositorioTenant.findOne({
        where: { dominio },
      });

      if (!tenant) {
        this.logger.log('🌱 Creando tenant de desarrollo en BD maestra...');
        tenant = this.repositorioTenant.create({
          nombre:      process.env.TENANT_DEV_NOMBRE    ?? 'Clínica Local (Desarrollo)',
          dominio,
          slug:        process.env.TENANT_DEV_SLUG      ?? 'localhost',
          dbHost:      process.env.TENANT_DEV_DB_HOST   ?? process.env.DB_HOST     ?? '127.0.0.1',
          dbPort:      parseInt(process.env.TENANT_DEV_DB_PORT ?? process.env.DB_PORT ?? '5432', 10),
          dbUsername:  process.env.TENANT_DEV_DB_USERNAME ?? process.env.DB_USERNAME ?? 'admin',
          dbPassword:  process.env.TENANT_DEV_DB_PASSWORD ?? process.env.DB_PASSWORD ?? 'admin123',
          dbDatabase:  process.env.TENANT_DEV_DB_DATABASE ?? process.env.DB_DATABASE ?? 'portal_paciente',
          activo:      true,
        });

        await this.repositorioTenant.save(tenant);
        this.logger.log(`✅ Tenant de desarrollo creado: ${tenant.nombre} → BD: ${tenant.dbDatabase}`);
      } else {
        this.logger.log(`✔ Tenant de desarrollo ya existe: ${tenant.nombre} → BD: ${tenant.dbDatabase}`);
      }

      // 2. Conectar al tenant → synchronize:true crea/actualiza tablas
      await this.connectionManager.obtenerConexion(tenant);
      this.logger.log('✅ Tablas del tenant de desarrollo sincronizadas');

    } catch (error) {
      this.logger.error('❌ Error en SeederMaestro', error);
      // No lanzamos el error para no bloquear otros seeders/módulos
    }
  }
}

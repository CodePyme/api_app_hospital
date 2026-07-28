import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { DataSource, DataSourceOptions } from 'typeorm';
import { Tenant } from './tenant.entity';
import { Usuario } from '../autenticacion/entities/usuario.entity';
import { Paciente } from '../pacientes/entities/paciente.entity';
import { Cita } from '../citas/entities/cita.entity';

/**
 * Entidades que pertenecen a cada base de datos de tenant.
 * Agregar aquí cualquier nueva entidad que se cree en el proyecto.
 */
const ENTIDADES_TENANT = [Usuario, Paciente, Cita];

@Injectable()
export class TenantConnectionManager implements OnModuleDestroy {
  private readonly logger = new Logger(TenantConnectionManager.name);

  /**
   * Mapa que cachea las conexiones activas por dominio de tenant.
   * Key: dominio (ej: "clinica-abc.com")
   * Value: DataSource inicializada y lista para usar
   */
  private readonly conexiones = new Map<string, DataSource>();

  /**
   * Obtiene (o crea) una conexión DataSource para el tenant dado.
   * Cachea la conexión para evitar reconexiones en cada request.
   */
  async obtenerConexion(tenant: Tenant): Promise<DataSource> {
    const dominio = tenant.dominio;

    // Retornar conexión cacheada si ya existe y está inicializada
    if (this.conexiones.has(dominio)) {
      const conexionExistente = this.conexiones.get(dominio)!;
      if (conexionExistente.isInitialized) {
        return conexionExistente;
      }
    }

    // Crear nueva conexión para el tenant
    this.logger.log(`🔌 Creando conexión para tenant: ${tenant.nombre} (${dominio})`);

    const opciones: DataSourceOptions = {
      type: 'postgres',
      host: tenant.dbHost,
      port: tenant.dbPort,
      username: tenant.dbUsername,
      password: tenant.dbPassword,
      database: tenant.dbDatabase,
      entities: ENTIDADES_TENANT,
      synchronize: process.env.DB_SINCRONIZAR === 'true',
      logging: process.env.DB_REGISTRO === 'true',
    };

    const nuevaConexion = new DataSource(opciones);
    await nuevaConexion.initialize();

    this.conexiones.set(dominio, nuevaConexion);
    this.logger.log(`✅ Conexión establecida para tenant: ${tenant.nombre}`);

    return nuevaConexion;
  }

  /**
   * Cierra todas las conexiones activas al destruir el módulo.
   */
  async onModuleDestroy(): Promise<void> {
    this.logger.log('🔌 Cerrando conexiones de tenants...');

    const promesasCierre = Array.from(this.conexiones.values())
      .filter((conexion) => conexion.isInitialized)
      .map((conexion) => conexion.destroy());

    await Promise.all(promesasCierre);
    this.conexiones.clear();
    this.logger.log('✅ Todas las conexiones de tenants cerradas');
  }

  /**
   * Cierra la conexión de un tenant específico (útil para mantenimiento).
   */
  async cerrarConexion(dominio: string): Promise<void> {
    const conexion = this.conexiones.get(dominio);
    if (conexion?.isInitialized) {
      await conexion.destroy();
      this.conexiones.delete(dominio);
      this.logger.log(`🔌 Conexión cerrada para tenant: ${dominio}`);
    }
  }

  /**
   * Retorna el número de conexiones activas (útil para monitoreo).
   */
  get totalConexionesActivas(): number {
    return Array.from(this.conexiones.values()).filter((c) => c.isInitialized).length;
  }
}

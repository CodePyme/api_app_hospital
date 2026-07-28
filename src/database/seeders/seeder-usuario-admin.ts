import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Usuario, RolUsuario } from '../../autenticacion/entities/usuario.entity';
import { TenantService } from '../../tenants/tenant.service';
import { TenantConnectionManager } from '../../tenants/tenant-connection.manager';

@Injectable()
export class SeederUsuarioAdmin implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeederUsuarioAdmin.name);

  private readonly CORREO_ADMIN = 'admin@codepyme.com';
  private readonly CONTRASENA_ADMIN = 'admin123';
  private readonly RONDAS_HASH = 10;

  constructor(
    private readonly tenantService: TenantService,
    private readonly connectionManager: TenantConnectionManager,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    await this.sembrarUsuarioAdmin();
  }

  private async sembrarUsuarioAdmin(): Promise<void> {
    try {
      // 1. Obtener todos los tenants activos
      const tenantsPaginados = await this.tenantService.obtenerTodosTenants(1, 1000);
      const tenants = tenantsPaginados.datos;

      for (const tenant of tenants) {
        if (!tenant.activo) continue;

        try {
          // 2. Obtener conexión para este tenant
          const conexion = await this.connectionManager.obtenerConexion(tenant);
          const repositorioUsuario = conexion.getRepository(Usuario);

          const adminExistente = await repositorioUsuario.findOne({
            where: { correoElectronico: this.CORREO_ADMIN },
          });

          if (adminExistente) {
            this.logger.log(`✔ Usuario admin ya existe en tenant: ${tenant.nombre}`);
            continue;
          }

          const contrasenaHasheada = await bcrypt.hash(
            this.CONTRASENA_ADMIN,
            this.RONDAS_HASH,
          );

          const nuevoAdmin = repositorioUsuario.create({
            nombres: 'Administrador',
            apellidos: 'Sistema',
            correoElectronico: this.CORREO_ADMIN,
            contrasena: contrasenaHasheada,
            rol: RolUsuario.ADMINISTRADOR,
            activo: true,
          });

          await repositorioUsuario.save(nuevoAdmin);
          this.logger.log(`✅ Usuario admin creado en tenant: ${tenant.nombre}`);
        } catch (errorTenant) {
          this.logger.error(`❌ Error al sembrar admin en tenant ${tenant.nombre}`, errorTenant);
        }
      }
    } catch (error) {
      this.logger.error('❌ Error al obtener tenants para sembrado', error);
    }
  }
}

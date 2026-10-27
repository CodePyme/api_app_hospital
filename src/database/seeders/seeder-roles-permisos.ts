import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { TenantService } from '../../tenants/tenant.service';
import { TenantConnectionManager } from '../../tenants/tenant-connection.manager';
import { Permiso } from '../../permisos/entities/permiso.entity';
import { Rol } from '../../roles/entities/rol.entity';
import { Usuario, RolUsuario } from '../../autenticacion/entities/usuario.entity';
import { CATALOGO_PERMISOS } from '../../permisos/constantes/catalogo-permisos';

@Injectable()
export class SeederRolesPermisos implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeederRolesPermisos.name);

  constructor(
    private readonly tenantService: TenantService,
    private readonly connectionManager: TenantConnectionManager,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    await this.sembrarRolesYPermisos();
  }

  private async sembrarRolesYPermisos(): Promise<void> {
    try {
      const tenantsPaginados = await this.tenantService.obtenerTodosTenants(1, 1000);
      const tenants = tenantsPaginados.datos;

      for (const tenant of tenants) {
        if (!tenant.activo) continue;

        try {
          const conexion = await this.connectionManager.obtenerConexion(tenant);
          const repoPermiso = conexion.getRepository(Permiso);
          const repoRol = conexion.getRepository(Rol);
          const repoUsuario = conexion.getRepository(Usuario);

          // 1. Sincronizar catálogo de permisos
          const permisosMap = new Map<string, Permiso>();
          for (const item of CATALOGO_PERMISOS) {
            let permiso = await repoPermiso.findOne({ where: { codigo: item.codigo } });
            if (!permiso) {
              permiso = repoPermiso.create({
                codigo: item.codigo,
                nombre: item.nombre,
                descripcion: item.descripcion,
                modulo: item.modulo,
                activo: true,
              });
              permiso = await repoPermiso.save(permiso);
            }
            permisosMap.set(permiso.codigo, permiso);
          }

          const todosLosPermisos = Array.from(permisosMap.values());

          // 2. Roles del Sistema a inicializar
          const rolesBase = [
            {
              codigo: 'administrador',
              nombre: 'Administrador del Sistema',
              descripcion: 'Acceso total y configuración de la plataforma',
              esSistema: true,
              permisos: todosLosPermisos,
            },
            {
              codigo: 'paciente',
              nombre: 'Paciente',
              descripcion: 'Portal de autoconsulta de citas y resultados clínicos',
              esSistema: true,
              permisos: [
                'dashboard.ver',
                'citas.ver',
                'citas.crear',
                'citas.cancelar',
                'resultados.ver',
                'resultados.descargar',
                'historia.ver',
                'historia.descargar',
                'medicamentos.ver',
              ]
                .map((cod) => permisosMap.get(cod))
                .filter((p): p is Permiso => Boolean(p)),
            },
            {
              codigo: 'medico',
              nombre: 'Médico',
              descripcion: 'Atención médica y consulta de historia clínica y ayudas diagnósticas',
              esSistema: true,
              permisos: [
                'dashboard.ver',
                'pacientes.ver',
                'citas.ver',
                'resultados.ver',
                'resultados.descargar',
                'historia.ver',
                'historia.descargar',
                'medicamentos.ver',
              ]
                .map((cod) => permisosMap.get(cod))
                .filter((p): p is Permiso => Boolean(p)),
            },
            {
              codigo: 'recepcionista',
              nombre: 'Recepcionista',
              descripcion: 'Gestión y agendamiento de pacientes y citas médicas',
              esSistema: true,
              permisos: [
                'dashboard.ver',
                'pacientes.ver',
                'pacientes.crear',
                'pacientes.editar',
                'citas.ver',
                'citas.crear',
                'citas.cancelar',
              ]
                .map((cod) => permisosMap.get(cod))
                .filter((p): p is Permiso => Boolean(p)),
            },
          ];

          const rolesMap = new Map<string, Rol>();
          for (const def of rolesBase) {
            let rol = await repoRol.findOne({
              where: { codigo: def.codigo },
              relations: { permisos: true },
            });

            if (!rol) {
              rol = repoRol.create({
                codigo: def.codigo,
                nombre: def.nombre,
                descripcion: def.descripcion,
                esSistema: def.esSistema,
                activo: true,
                permisos: def.permisos,
              });
              rol = await repoRol.save(rol);
            } else {
              // Asegurar que el rol del sistema tenga los permisos actualizados
              rol.permisos = def.permisos;
              rol = await repoRol.save(rol);
            }
            rolesMap.set(rol.codigo, rol);
          }

          // 3. Vincular usuarios existentes sin rol_id asignado
          const rolAdmin = rolesMap.get('administrador');
          const rolPaciente = rolesMap.get('paciente');

          if (rolAdmin) {
            const adminsSinRol = await repoUsuario.find({
              where: [
                { rol: RolUsuario.ADMINISTRADOR },
                { correoElectronico: 'admin@codepyme.com' },
                { correoElectronico: 'cristian@codepyme.com' },
              ],
            });

            for (const admin of adminsSinRol) {
              if (!admin.rolId || admin.rolId !== rolAdmin.id) {
                admin.rolId = rolAdmin.id;
                admin.rol = RolUsuario.ADMINISTRADOR;
                await repoUsuario.save(admin);
              }
            }
          }

          if (rolPaciente) {
            const pacientesSinRol = await repoUsuario.find({
              where: { rol: RolUsuario.PACIENTE },
            });

            for (const p of pacientesSinRol) {
              if (!p.rolId) {
                p.rolId = rolPaciente.id;
                await repoUsuario.save(p);
              }
            }
          }

          this.logger.log(`✅ Roles y permisos sincronizados para tenant: ${tenant.nombre}`);
        } catch (errorTenant) {
          this.logger.error(
            `❌ Error al sembrar roles y permisos en tenant ${tenant.nombre}`,
            errorTenant,
          );
        }
      }
    } catch (error) {
      this.logger.error('❌ Error al obtener tenants para roles y permisos', error);
    }
  }
}

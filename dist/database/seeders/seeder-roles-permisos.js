"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var SeederRolesPermisos_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeederRolesPermisos = void 0;
const common_1 = require("@nestjs/common");
const tenant_service_1 = require("../../tenants/tenant.service");
const tenant_connection_manager_1 = require("../../tenants/tenant-connection.manager");
const permiso_entity_1 = require("../../permisos/entities/permiso.entity");
const rol_entity_1 = require("../../roles/entities/rol.entity");
const usuario_entity_1 = require("../../autenticacion/entities/usuario.entity");
const catalogo_permisos_1 = require("../../permisos/constantes/catalogo-permisos");
let SeederRolesPermisos = SeederRolesPermisos_1 = class SeederRolesPermisos {
    tenantService;
    connectionManager;
    logger = new common_1.Logger(SeederRolesPermisos_1.name);
    constructor(tenantService, connectionManager) {
        this.tenantService = tenantService;
        this.connectionManager = connectionManager;
    }
    async onApplicationBootstrap() {
        await this.sembrarRolesYPermisos();
    }
    async sembrarRolesYPermisos() {
        try {
            const tenantsPaginados = await this.tenantService.obtenerTodosTenants(1, 1000);
            const tenants = tenantsPaginados.datos;
            for (const tenant of tenants) {
                if (!tenant.activo)
                    continue;
                try {
                    const conexion = await this.connectionManager.obtenerConexion(tenant);
                    const repoPermiso = conexion.getRepository(permiso_entity_1.Permiso);
                    const repoRol = conexion.getRepository(rol_entity_1.Rol);
                    const repoUsuario = conexion.getRepository(usuario_entity_1.Usuario);
                    const permisosMap = new Map();
                    for (const item of catalogo_permisos_1.CATALOGO_PERMISOS) {
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
                                .filter((p) => Boolean(p)),
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
                                .filter((p) => Boolean(p)),
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
                                .filter((p) => Boolean(p)),
                        },
                    ];
                    const rolesMap = new Map();
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
                        }
                        else {
                            rol.permisos = def.permisos;
                            rol = await repoRol.save(rol);
                        }
                        rolesMap.set(rol.codigo, rol);
                    }
                    const rolAdmin = rolesMap.get('administrador');
                    const rolPaciente = rolesMap.get('paciente');
                    if (rolAdmin) {
                        const adminsSinRol = await repoUsuario.find({
                            where: [
                                { rol: usuario_entity_1.RolUsuario.ADMINISTRADOR },
                                { correoElectronico: 'admin@codepyme.com' },
                                { correoElectronico: 'cristian@codepyme.com' },
                            ],
                        });
                        for (const admin of adminsSinRol) {
                            if (!admin.rolId || admin.rolId !== rolAdmin.id) {
                                admin.rolId = rolAdmin.id;
                                admin.rol = usuario_entity_1.RolUsuario.ADMINISTRADOR;
                                await repoUsuario.save(admin);
                            }
                        }
                    }
                    if (rolPaciente) {
                        const pacientesSinRol = await repoUsuario.find({
                            where: { rol: usuario_entity_1.RolUsuario.PACIENTE },
                        });
                        for (const p of pacientesSinRol) {
                            if (!p.rolId) {
                                p.rolId = rolPaciente.id;
                                await repoUsuario.save(p);
                            }
                        }
                    }
                    this.logger.log(`✅ Roles y permisos sincronizados para tenant: ${tenant.nombre}`);
                }
                catch (errorTenant) {
                    this.logger.error(`❌ Error al sembrar roles y permisos en tenant ${tenant.nombre}`, errorTenant);
                }
            }
        }
        catch (error) {
            this.logger.error('❌ Error al obtener tenants para roles y permisos', error);
        }
    }
};
exports.SeederRolesPermisos = SeederRolesPermisos;
exports.SeederRolesPermisos = SeederRolesPermisos = SeederRolesPermisos_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [tenant_service_1.TenantService,
        tenant_connection_manager_1.TenantConnectionManager])
], SeederRolesPermisos);
//# sourceMappingURL=seeder-roles-permisos.js.map
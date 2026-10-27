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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermisosService = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const typeorm_1 = require("typeorm");
const permiso_entity_1 = require("./entities/permiso.entity");
const catalogo_permisos_1 = require("./constantes/catalogo-permisos");
let PermisosService = class PermisosService {
    request;
    constructor(request) {
        this.request = request;
    }
    get repositorioPermiso() {
        return this.request.tenantConexion.getRepository(permiso_entity_1.Permiso);
    }
    async obtenerTodos() {
        const permisos = await this.repositorioPermiso.find({
            where: { modulo: (0, typeorm_1.Not)('tenants') },
            order: { modulo: 'ASC', nombre: 'ASC' },
        });
        return {
            exito: true,
            mensaje: 'Permisos obtenidos exitosamente',
            datos: permisos,
        };
    }
    async obtenerPorModulo() {
        const permisos = await this.repositorioPermiso.find({
            where: { activo: true, modulo: (0, typeorm_1.Not)('tenants') },
            order: { modulo: 'ASC', nombre: 'ASC' },
        });
        const agrupados = {};
        for (const p of permisos) {
            if (p.modulo === 'tenants')
                continue;
            if (!agrupados[p.modulo]) {
                agrupados[p.modulo] = [];
            }
            agrupados[p.modulo].push(p);
        }
        return {
            exito: true,
            mensaje: 'Permisos agrupados por módulo obtenidos exitosamente',
            datos: agrupados,
        };
    }
    async obtenerPorId(id) {
        const permiso = await this.repositorioPermiso.findOne({ where: { id } });
        if (!permiso) {
            throw new common_1.NotFoundException(`Permiso con ID "${id}" no encontrado`);
        }
        return {
            exito: true,
            mensaje: 'Permiso obtenido exitosamente',
            datos: permiso,
        };
    }
    async crear(crearPermisoDto) {
        const codigoLimpio = crearPermisoDto.codigo.trim().toLowerCase();
        const moduloLimpio = crearPermisoDto.modulo.trim().toLowerCase();
        if (moduloLimpio === 'tenants' || codigoLimpio.startsWith('tenants.')) {
            throw new common_1.BadRequestException('El módulo tenants es de gestión exclusiva de super-administrador y no admite permisos asignables');
        }
        const existe = await this.repositorioPermiso.findOne({
            where: { codigo: codigoLimpio },
        });
        if (existe) {
            throw new common_1.ConflictException(`Ya existe un permiso con el código "${codigoLimpio}"`);
        }
        const nuevoPermiso = this.repositorioPermiso.create({
            ...crearPermisoDto,
            codigo: codigoLimpio,
        });
        const guardado = await this.repositorioPermiso.save(nuevoPermiso);
        return {
            exito: true,
            mensaje: 'Permiso creado exitosamente',
            datos: guardado,
        };
    }
    async actualizar(id, actualizarPermisoDto) {
        const permiso = await this.repositorioPermiso.findOne({ where: { id } });
        if (!permiso) {
            throw new common_1.NotFoundException(`Permiso con ID "${id}" no encontrado`);
        }
        if (actualizarPermisoDto.codigo) {
            const codigoLimpio = actualizarPermisoDto.codigo.trim().toLowerCase();
            if (codigoLimpio !== permiso.codigo) {
                const existeOtro = await this.repositorioPermiso.findOne({
                    where: { codigo: codigoLimpio },
                });
                if (existeOtro) {
                    throw new common_1.ConflictException(`Ya existe otro permiso con el código "${codigoLimpio}"`);
                }
                permiso.codigo = codigoLimpio;
            }
        }
        if (actualizarPermisoDto.nombre !== undefined)
            permiso.nombre = actualizarPermisoDto.nombre;
        if (actualizarPermisoDto.descripcion !== undefined)
            permiso.descripcion = actualizarPermisoDto.descripcion;
        if (actualizarPermisoDto.modulo !== undefined)
            permiso.modulo = actualizarPermisoDto.modulo;
        if (actualizarPermisoDto.activo !== undefined)
            permiso.activo = actualizarPermisoDto.activo;
        const actualizado = await this.repositorioPermiso.save(permiso);
        return {
            exito: true,
            mensaje: 'Permiso actualizado exitosamente',
            datos: actualizado,
        };
    }
    async eliminar(id) {
        const permiso = await this.repositorioPermiso.findOne({
            where: { id },
            relations: { roles: true, usuarios: true },
        });
        if (!permiso) {
            throw new common_1.NotFoundException(`Permiso con ID "${id}" no encontrado`);
        }
        if (permiso.roles?.length > 0 || permiso.usuarios?.length > 0) {
            throw new common_1.BadRequestException('No se puede eliminar el permiso porque está asignado a uno o más roles o usuarios. Desasígnalo primero o desactívalo.');
        }
        await this.repositorioPermiso.remove(permiso);
        return {
            exito: true,
            mensaje: 'Permiso eliminado exitosamente',
            datos: null,
        };
    }
    async sincronizarCatalogo() {
        let creados = 0;
        let existentes = 0;
        for (const item of catalogo_permisos_1.CATALOGO_PERMISOS) {
            const permisoExistente = await this.repositorioPermiso.findOne({
                where: { codigo: item.codigo },
            });
            if (!permisoExistente) {
                const nuevo = this.repositorioPermiso.create({
                    codigo: item.codigo,
                    nombre: item.nombre,
                    descripcion: item.descripcion,
                    modulo: item.modulo,
                    activo: true,
                });
                await this.repositorioPermiso.save(nuevo);
                creados++;
            }
            else {
                existentes++;
            }
        }
        return {
            exito: true,
            mensaje: `Sincronización completada: ${creados} permisos creados, ${existentes} ya existentes`,
            datos: { creados, existentes },
        };
    }
};
exports.PermisosService = PermisosService;
exports.PermisosService = PermisosService = __decorate([
    (0, common_1.Injectable)({ scope: common_1.Scope.REQUEST }),
    __param(0, (0, common_1.Inject)(core_1.REQUEST)),
    __metadata("design:paramtypes", [Object])
], PermisosService);
//# sourceMappingURL=permisos.service.js.map
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
exports.RolesService = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const typeorm_1 = require("typeorm");
const rol_entity_1 = require("./entities/rol.entity");
const permiso_entity_1 = require("../permisos/entities/permiso.entity");
let RolesService = class RolesService {
    request;
    constructor(request) {
        this.request = request;
    }
    get repositorioRol() {
        return this.request.tenantConexion.getRepository(rol_entity_1.Rol);
    }
    get repositorioPermiso() {
        return this.request.tenantConexion.getRepository(permiso_entity_1.Permiso);
    }
    async obtenerTodos() {
        const roles = await this.repositorioRol.find({
            relations: { permisos: true, usuarios: true },
            order: { nombre: 'ASC' },
        });
        const rolesConConteo = roles.map((rol) => ({
            id: rol.id,
            codigo: rol.codigo,
            nombre: rol.nombre,
            descripcion: rol.descripcion,
            esSistema: rol.esSistema,
            activo: rol.activo,
            totalUsuarios: rol.usuarios?.length || 0,
            totalPermisos: rol.permisos?.length || 0,
            permisos: rol.permisos || [],
            creadoEn: rol.creadoEn,
            actualizadoEn: rol.actualizadoEn,
        }));
        return {
            exito: true,
            mensaje: 'Roles obtenidos exitosamente',
            datos: rolesConConteo,
        };
    }
    async obtenerPorId(id) {
        const rol = await this.repositorioRol.findOne({
            where: { id },
            relations: { permisos: true },
        });
        if (!rol) {
            throw new common_1.NotFoundException(`Rol con ID "${id}" no encontrado`);
        }
        return {
            exito: true,
            mensaje: 'Rol obtenido exitosamente',
            datos: rol,
        };
    }
    async crear(crearRolDto) {
        const codigoLimpio = crearRolDto.codigo.trim().toLowerCase().replace(/\s+/g, '_');
        const existe = await this.repositorioRol.findOne({
            where: { codigo: codigoLimpio },
        });
        if (existe) {
            throw new common_1.ConflictException(`Ya existe un rol con el código "${codigoLimpio}"`);
        }
        let permisos = [];
        if (crearRolDto.permisoIds && crearRolDto.permisoIds.length > 0) {
            permisos = await this.repositorioPermiso.findBy({
                id: (0, typeorm_1.In)(crearRolDto.permisoIds),
            });
        }
        const nuevoRol = this.repositorioRol.create({
            codigo: codigoLimpio,
            nombre: crearRolDto.nombre.trim(),
            descripcion: crearRolDto.descripcion?.trim(),
            activo: crearRolDto.activo !== undefined ? crearRolDto.activo : true,
            esSistema: false,
            permisos,
        });
        const guardado = await this.repositorioRol.save(nuevoRol);
        return {
            exito: true,
            mensaje: 'Rol creado exitosamente',
            datos: guardado,
        };
    }
    async actualizar(id, actualizarRolDto) {
        const rol = await this.repositorioRol.findOne({
            where: { id },
            relations: { permisos: true },
        });
        if (!rol) {
            throw new common_1.NotFoundException(`Rol con ID "${id}" no encontrado`);
        }
        if (actualizarRolDto.codigo) {
            const codigoLimpio = actualizarRolDto.codigo.trim().toLowerCase().replace(/\s+/g, '_');
            if (codigoLimpio !== rol.codigo) {
                if (rol.esSistema) {
                    throw new common_1.BadRequestException('No se puede modificar el código de un rol del sistema');
                }
                const existeOtro = await this.repositorioRol.findOne({
                    where: { codigo: codigoLimpio },
                });
                if (existeOtro) {
                    throw new common_1.ConflictException(`Ya existe otro rol con el código "${codigoLimpio}"`);
                }
                rol.codigo = codigoLimpio;
            }
        }
        if (actualizarRolDto.nombre !== undefined)
            rol.nombre = actualizarRolDto.nombre.trim();
        if (actualizarRolDto.descripcion !== undefined)
            rol.descripcion = actualizarRolDto.descripcion?.trim();
        if (actualizarRolDto.activo !== undefined) {
            if (rol.esSistema && actualizarRolDto.activo === false) {
                throw new common_1.BadRequestException('No se puede desactivar un rol del sistema');
            }
            rol.activo = actualizarRolDto.activo;
        }
        if (actualizarRolDto.permisoIds !== undefined) {
            if (actualizarRolDto.permisoIds.length > 0) {
                rol.permisos = await this.repositorioPermiso.findBy({
                    id: (0, typeorm_1.In)(actualizarRolDto.permisoIds),
                });
            }
            else {
                rol.permisos = [];
            }
        }
        const actualizado = await this.repositorioRol.save(rol);
        return {
            exito: true,
            mensaje: 'Rol actualizado exitosamente',
            datos: actualizado,
        };
    }
    async eliminar(id) {
        const rol = await this.repositorioRol.findOne({
            where: { id },
            relations: { usuarios: true },
        });
        if (!rol) {
            throw new common_1.NotFoundException(`Rol con ID "${id}" no encontrado`);
        }
        if (rol.esSistema) {
            throw new common_1.BadRequestException('No se puede eliminar un rol protegido del sistema');
        }
        if (rol.usuarios && rol.usuarios.length > 0) {
            throw new common_1.BadRequestException(`No se puede eliminar el rol porque tiene ${rol.usuarios.length} usuario(s) asignado(s). Reasigna los usuarios primero.`);
        }
        await this.repositorioRol.remove(rol);
        return {
            exito: true,
            mensaje: 'Rol eliminado exitosamente',
            datos: null,
        };
    }
};
exports.RolesService = RolesService;
exports.RolesService = RolesService = __decorate([
    (0, common_1.Injectable)({ scope: common_1.Scope.REQUEST }),
    __param(0, (0, common_1.Inject)(core_1.REQUEST)),
    __metadata("design:paramtypes", [Object])
], RolesService);
//# sourceMappingURL=roles.service.js.map
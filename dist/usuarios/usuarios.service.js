"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsuariosService = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const typeorm_1 = require("typeorm");
const bcrypt = __importStar(require("bcrypt"));
const usuario_entity_1 = require("../autenticacion/entities/usuario.entity");
const rol_entity_1 = require("../roles/entities/rol.entity");
const permiso_entity_1 = require("../permisos/entities/permiso.entity");
const permisos_utils_1 = require("../permisos/permisos.utils");
let UsuariosService = class UsuariosService {
    request;
    RONDAS_HASH = 10;
    CORREO_SUPER_ADMIN = 'admin@codepyme.com';
    constructor(request) {
        this.request = request;
    }
    get repositorioUsuario() {
        return this.request.tenantConexion.getRepository(usuario_entity_1.Usuario);
    }
    get repositorioRol() {
        return this.request.tenantConexion.getRepository(rol_entity_1.Rol);
    }
    get repositorioPermiso() {
        return this.request.tenantConexion.getRepository(permiso_entity_1.Permiso);
    }
    async obtenerUsuarios(incluirPacientes = false) {
        const whereCondition = {};
        if (!incluirPacientes) {
            whereCondition.rol = (0, typeorm_1.Not)(usuario_entity_1.RolUsuario.PACIENTE);
        }
        const usuarios = await this.repositorioUsuario.find({
            where: whereCondition,
            relations: { rolEntidad: { permisos: true }, permisosDirectos: true },
            order: { creadoEn: 'DESC' },
        });
        const usuariosMapeados = usuarios.map((u) => {
            const { contrasena: _, ...resto } = u;
            return {
                ...resto,
                permisosConsolidados: (0, permisos_utils_1.calcularPermisosConsolidados)(u),
            };
        });
        return {
            exito: true,
            mensaje: 'Usuarios obtenidos exitosamente',
            datos: usuariosMapeados,
        };
    }
    async obtenerPorId(id) {
        const usuario = await this.repositorioUsuario.findOne({
            where: { id },
            relations: { rolEntidad: { permisos: true }, permisosDirectos: true },
        });
        if (!usuario) {
            throw new common_1.NotFoundException(`Usuario con ID "${id}" no encontrado`);
        }
        const { contrasena: _, ...resto } = usuario;
        return {
            exito: true,
            mensaje: 'Usuario obtenido exitosamente',
            datos: {
                ...resto,
                permisosConsolidados: (0, permisos_utils_1.calcularPermisosConsolidados)(usuario),
            },
        };
    }
    async crear(crearUsuarioDto) {
        const correoLimpio = crearUsuarioDto.correoElectronico.trim().toLowerCase();
        const existe = await this.repositorioUsuario.findOne({
            where: { correoElectronico: correoLimpio },
        });
        if (existe) {
            throw new common_1.ConflictException(`Ya existe un usuario con el correo "${correoLimpio}"`);
        }
        const rol = await this.repositorioRol.findOne({
            where: { id: crearUsuarioDto.rolId },
        });
        if (!rol) {
            throw new common_1.NotFoundException('El rol especificado no existe');
        }
        let permisosDirectos = [];
        if (crearUsuarioDto.permisoIds && crearUsuarioDto.permisoIds.length > 0) {
            permisosDirectos = await this.repositorioPermiso.findBy({
                id: (0, typeorm_1.In)(crearUsuarioDto.permisoIds),
            });
        }
        const contrasenaHasheada = await bcrypt.hash(crearUsuarioDto.contrasena, this.RONDAS_HASH);
        let rolEnum = usuario_entity_1.RolUsuario.ADMINISTRADOR;
        if (rol.codigo === 'medico')
            rolEnum = usuario_entity_1.RolUsuario.MEDICO;
        else if (rol.codigo === 'recepcionista')
            rolEnum = usuario_entity_1.RolUsuario.RECEPCIONISTA;
        else if (rol.codigo === 'paciente')
            rolEnum = usuario_entity_1.RolUsuario.PACIENTE;
        const nuevoUsuario = this.repositorioUsuario.create({
            nombres: crearUsuarioDto.nombres.trim(),
            apellidos: crearUsuarioDto.apellidos.trim(),
            correoElectronico: correoLimpio,
            contrasena: contrasenaHasheada,
            rol: rolEnum,
            rolId: rol.id,
            rolEntidad: rol,
            permisosDirectos,
            activo: crearUsuarioDto.activo !== undefined ? crearUsuarioDto.activo : true,
        });
        const guardado = await this.repositorioUsuario.save(nuevoUsuario);
        const { contrasena: _, ...resto } = guardado;
        return {
            exito: true,
            mensaje: 'Usuario administrativo creado exitosamente',
            datos: {
                ...resto,
                permisosConsolidados: (0, permisos_utils_1.calcularPermisosConsolidados)(guardado),
            },
        };
    }
    async actualizar(id, actualizarUsuarioDto) {
        const usuario = await this.repositorioUsuario.findOne({
            where: { id },
            relations: { rolEntidad: true, permisosDirectos: true },
        });
        if (!usuario) {
            throw new common_1.NotFoundException(`Usuario con ID "${id}" no encontrado`);
        }
        if (actualizarUsuarioDto.correoElectronico) {
            const correoLimpio = actualizarUsuarioDto.correoElectronico.trim().toLowerCase();
            if (correoLimpio !== usuario.correoElectronico) {
                if (usuario.correoElectronico === this.CORREO_SUPER_ADMIN) {
                    throw new common_1.BadRequestException('No se puede modificar el correo del super administrador');
                }
                const existeOtro = await this.repositorioUsuario.findOne({
                    where: { correoElectronico: correoLimpio },
                });
                if (existeOtro) {
                    throw new common_1.ConflictException(`Ya existe otro usuario con el correo "${correoLimpio}"`);
                }
                usuario.correoElectronico = correoLimpio;
            }
        }
        if (actualizarUsuarioDto.nombres !== undefined)
            usuario.nombres = actualizarUsuarioDto.nombres.trim();
        if (actualizarUsuarioDto.apellidos !== undefined)
            usuario.apellidos = actualizarUsuarioDto.apellidos.trim();
        if (actualizarUsuarioDto.contrasena && actualizarUsuarioDto.contrasena.trim().length >= 6) {
            usuario.contrasena = await bcrypt.hash(actualizarUsuarioDto.contrasena.trim(), this.RONDAS_HASH);
        }
        if (actualizarUsuarioDto.activo !== undefined) {
            if (usuario.correoElectronico === this.CORREO_SUPER_ADMIN && !actualizarUsuarioDto.activo) {
                throw new common_1.BadRequestException('No se puede desactivar al super administrador');
            }
            usuario.activo = actualizarUsuarioDto.activo;
        }
        if (actualizarUsuarioDto.rolId !== undefined) {
            const rol = await this.repositorioRol.findOne({
                where: { id: actualizarUsuarioDto.rolId },
            });
            if (!rol) {
                throw new common_1.NotFoundException('El rol especificado no existe');
            }
            usuario.rolId = rol.id;
            usuario.rolEntidad = rol;
            if (rol.codigo === 'medico')
                usuario.rol = usuario_entity_1.RolUsuario.MEDICO;
            else if (rol.codigo === 'recepcionista')
                usuario.rol = usuario_entity_1.RolUsuario.RECEPCIONISTA;
            else if (rol.codigo === 'paciente')
                usuario.rol = usuario_entity_1.RolUsuario.PACIENTE;
            else
                usuario.rol = usuario_entity_1.RolUsuario.ADMINISTRADOR;
        }
        if (actualizarUsuarioDto.permisoIds !== undefined) {
            if (actualizarUsuarioDto.permisoIds.length > 0) {
                usuario.permisosDirectos = await this.repositorioPermiso.findBy({
                    id: (0, typeorm_1.In)(actualizarUsuarioDto.permisoIds),
                });
            }
            else {
                usuario.permisosDirectos = [];
            }
        }
        const guardado = await this.repositorioUsuario.save(usuario);
        const { contrasena: _, ...resto } = guardado;
        return {
            exito: true,
            mensaje: 'Usuario actualizado exitosamente',
            datos: {
                ...resto,
                permisosConsolidados: (0, permisos_utils_1.calcularPermisosConsolidados)(guardado),
            },
        };
    }
    async cambiarContrasena(id, dto) {
        const usuario = await this.repositorioUsuario.findOne({ where: { id } });
        if (!usuario) {
            throw new common_1.NotFoundException(`Usuario con ID "${id}" no encontrado`);
        }
        usuario.contrasena = await bcrypt.hash(dto.nuevaContrasena.trim(), this.RONDAS_HASH);
        await this.repositorioUsuario.save(usuario);
        return {
            exito: true,
            mensaje: 'Contraseña actualizada exitosamente',
            datos: null,
        };
    }
    async eliminar(id) {
        const usuario = await this.repositorioUsuario.findOne({ where: { id } });
        if (!usuario) {
            throw new common_1.NotFoundException(`Usuario con ID "${id}" no encontrado`);
        }
        if (usuario.correoElectronico === this.CORREO_SUPER_ADMIN) {
            throw new common_1.BadRequestException('No se puede eliminar al super administrador de la plataforma');
        }
        await this.repositorioUsuario.remove(usuario);
        return {
            exito: true,
            mensaje: 'Usuario eliminado exitosamente',
            datos: null,
        };
    }
};
exports.UsuariosService = UsuariosService;
exports.UsuariosService = UsuariosService = __decorate([
    (0, common_1.Injectable)({ scope: common_1.Scope.REQUEST }),
    __param(0, (0, common_1.Inject)(core_1.REQUEST)),
    __metadata("design:paramtypes", [Object])
], UsuariosService);
//# sourceMappingURL=usuarios.service.js.map
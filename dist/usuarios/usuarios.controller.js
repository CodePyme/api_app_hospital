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
exports.UsuariosController = void 0;
const common_1 = require("@nestjs/common");
const usuarios_service_1 = require("./usuarios.service");
const crear_usuario_dto_1 = require("./dto/crear-usuario.dto");
const actualizar_usuario_dto_1 = require("./dto/actualizar-usuario.dto");
const cambiar_contrasena_dto_1 = require("./dto/cambiar-contrasena.dto");
const jwt_autenticacion_guard_1 = require("../common/guards/jwt-autenticacion.guard");
const permisos_guard_1 = require("../common/guards/permisos.guard");
const permisos_decorator_1 = require("../common/decorators/permisos.decorator");
let UsuariosController = class UsuariosController {
    usuariosService;
    constructor(usuariosService) {
        this.usuariosService = usuariosService;
    }
    async obtenerUsuarios(incluirPacientes) {
        const flag = incluirPacientes === 'true';
        return this.usuariosService.obtenerUsuarios(flag);
    }
    async obtenerPorId(id) {
        return this.usuariosService.obtenerPorId(id);
    }
    async crear(crearUsuarioDto) {
        return this.usuariosService.crear(crearUsuarioDto);
    }
    async actualizar(id, actualizarUsuarioDto) {
        return this.usuariosService.actualizar(id, actualizarUsuarioDto);
    }
    async cambiarContrasena(id, cambiarContrasenaDto) {
        return this.usuariosService.cambiarContrasena(id, cambiarContrasenaDto);
    }
    async eliminar(id) {
        return this.usuariosService.eliminar(id);
    }
};
exports.UsuariosController = UsuariosController;
__decorate([
    (0, common_1.Get)(),
    (0, permisos_decorator_1.RequierePermisos)('usuarios.ver'),
    __param(0, (0, common_1.Query)('incluirPacientes')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsuariosController.prototype, "obtenerUsuarios", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, permisos_decorator_1.RequierePermisos)('usuarios.ver'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsuariosController.prototype, "obtenerPorId", null);
__decorate([
    (0, common_1.Post)(),
    (0, permisos_decorator_1.RequierePermisos)('usuarios.crear'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [crear_usuario_dto_1.CrearUsuarioDto]),
    __metadata("design:returntype", Promise)
], UsuariosController.prototype, "crear", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, permisos_decorator_1.RequierePermisos)('usuarios.editar'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, actualizar_usuario_dto_1.ActualizarUsuarioDto]),
    __metadata("design:returntype", Promise)
], UsuariosController.prototype, "actualizar", null);
__decorate([
    (0, common_1.Put)(':id/cambiar-contrasena'),
    (0, permisos_decorator_1.RequierePermisos)('usuarios.editar'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, cambiar_contrasena_dto_1.CambiarContrasenaDto]),
    __metadata("design:returntype", Promise)
], UsuariosController.prototype, "cambiarContrasena", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, permisos_decorator_1.RequierePermisos)('usuarios.eliminar'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsuariosController.prototype, "eliminar", null);
exports.UsuariosController = UsuariosController = __decorate([
    (0, common_1.Controller)('usuarios'),
    (0, common_1.UseGuards)(jwt_autenticacion_guard_1.GuardJwtAutenticacion, permisos_guard_1.PermisosGuard),
    __metadata("design:paramtypes", [usuarios_service_1.UsuariosService])
], UsuariosController);
//# sourceMappingURL=usuarios.controller.js.map
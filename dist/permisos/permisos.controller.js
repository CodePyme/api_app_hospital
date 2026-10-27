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
exports.PermisosController = void 0;
const common_1 = require("@nestjs/common");
const permisos_service_1 = require("./permisos.service");
const crear_permiso_dto_1 = require("./dto/crear-permiso.dto");
const actualizar_permiso_dto_1 = require("./dto/actualizar-permiso.dto");
const jwt_autenticacion_guard_1 = require("../common/guards/jwt-autenticacion.guard");
const permisos_guard_1 = require("../common/guards/permisos.guard");
const permisos_decorator_1 = require("../common/decorators/permisos.decorator");
let PermisosController = class PermisosController {
    permisosService;
    constructor(permisosService) {
        this.permisosService = permisosService;
    }
    async obtenerTodos() {
        return this.permisosService.obtenerTodos();
    }
    async obtenerPorModulo() {
        return this.permisosService.obtenerPorModulo();
    }
    async sincronizarCatalogo() {
        return this.permisosService.sincronizarCatalogo();
    }
    async obtenerPorId(id) {
        return this.permisosService.obtenerPorId(id);
    }
    async crear(crearPermisoDto) {
        return this.permisosService.crear(crearPermisoDto);
    }
    async actualizar(id, actualizarPermisoDto) {
        return this.permisosService.actualizar(id, actualizarPermisoDto);
    }
    async eliminar(id) {
        return this.permisosService.eliminar(id);
    }
};
exports.PermisosController = PermisosController;
__decorate([
    (0, common_1.Get)(),
    (0, permisos_decorator_1.RequierePermisos)('permisos.ver', 'roles.ver', 'usuarios.ver'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PermisosController.prototype, "obtenerTodos", null);
__decorate([
    (0, common_1.Get)('agrupados'),
    (0, permisos_decorator_1.RequierePermisos)('permisos.ver', 'roles.ver', 'usuarios.ver'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PermisosController.prototype, "obtenerPorModulo", null);
__decorate([
    (0, common_1.Post)('sincronizar'),
    (0, permisos_decorator_1.RequierePermisos)('permisos.gestionar'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PermisosController.prototype, "sincronizarCatalogo", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, permisos_decorator_1.RequierePermisos)('permisos.ver'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PermisosController.prototype, "obtenerPorId", null);
__decorate([
    (0, common_1.Post)(),
    (0, permisos_decorator_1.RequierePermisos)('permisos.gestionar'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [crear_permiso_dto_1.CrearPermisoDto]),
    __metadata("design:returntype", Promise)
], PermisosController.prototype, "crear", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, permisos_decorator_1.RequierePermisos)('permisos.gestionar'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, actualizar_permiso_dto_1.ActualizarPermisoDto]),
    __metadata("design:returntype", Promise)
], PermisosController.prototype, "actualizar", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, permisos_decorator_1.RequierePermisos)('permisos.gestionar'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PermisosController.prototype, "eliminar", null);
exports.PermisosController = PermisosController = __decorate([
    (0, common_1.Controller)('permisos'),
    (0, common_1.UseGuards)(jwt_autenticacion_guard_1.GuardJwtAutenticacion, permisos_guard_1.PermisosGuard),
    __metadata("design:paramtypes", [permisos_service_1.PermisosService])
], PermisosController);
//# sourceMappingURL=permisos.controller.js.map
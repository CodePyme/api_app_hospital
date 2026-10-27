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
exports.RolesController = void 0;
const common_1 = require("@nestjs/common");
const roles_service_1 = require("./roles.service");
const crear_rol_dto_1 = require("./dto/crear-rol.dto");
const actualizar_rol_dto_1 = require("./dto/actualizar-rol.dto");
const jwt_autenticacion_guard_1 = require("../common/guards/jwt-autenticacion.guard");
const permisos_guard_1 = require("../common/guards/permisos.guard");
const permisos_decorator_1 = require("../common/decorators/permisos.decorator");
let RolesController = class RolesController {
    rolesService;
    constructor(rolesService) {
        this.rolesService = rolesService;
    }
    async obtenerTodos() {
        return this.rolesService.obtenerTodos();
    }
    async obtenerPorId(id) {
        return this.rolesService.obtenerPorId(id);
    }
    async crear(crearRolDto) {
        return this.rolesService.crear(crearRolDto);
    }
    async actualizar(id, actualizarRolDto) {
        return this.rolesService.actualizar(id, actualizarRolDto);
    }
    async eliminar(id) {
        return this.rolesService.eliminar(id);
    }
};
exports.RolesController = RolesController;
__decorate([
    (0, common_1.Get)(),
    (0, permisos_decorator_1.RequierePermisos)('roles.ver', 'usuarios.ver'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RolesController.prototype, "obtenerTodos", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, permisos_decorator_1.RequierePermisos)('roles.ver'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RolesController.prototype, "obtenerPorId", null);
__decorate([
    (0, common_1.Post)(),
    (0, permisos_decorator_1.RequierePermisos)('roles.crear'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [crear_rol_dto_1.CrearRolDto]),
    __metadata("design:returntype", Promise)
], RolesController.prototype, "crear", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, permisos_decorator_1.RequierePermisos)('roles.editar'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, actualizar_rol_dto_1.ActualizarRolDto]),
    __metadata("design:returntype", Promise)
], RolesController.prototype, "actualizar", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, permisos_decorator_1.RequierePermisos)('roles.eliminar'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RolesController.prototype, "eliminar", null);
exports.RolesController = RolesController = __decorate([
    (0, common_1.Controller)('roles'),
    (0, common_1.UseGuards)(jwt_autenticacion_guard_1.GuardJwtAutenticacion, permisos_guard_1.PermisosGuard),
    __metadata("design:paramtypes", [roles_service_1.RolesService])
], RolesController);
//# sourceMappingURL=roles.controller.js.map
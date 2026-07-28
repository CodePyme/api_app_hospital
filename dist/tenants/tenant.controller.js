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
exports.TenantController = void 0;
const common_1 = require("@nestjs/common");
const tenant_service_1 = require("./tenant.service");
const crear_tenant_dto_1 = require("./dto/crear-tenant.dto");
const actualizar_tenant_dto_1 = require("./dto/actualizar-tenant.dto");
const jwt_autenticacion_guard_1 = require("../common/guards/jwt-autenticacion.guard");
const super_admin_guard_1 = require("./guards/super-admin.guard");
let TenantController = class TenantController {
    tenantService;
    constructor(tenantService) {
        this.tenantService = tenantService;
    }
    obtenerTodos(pagina = 1, limite = 10) {
        return this.tenantService.obtenerTodosTenants(+pagina, +limite);
    }
    obtenerPorId(id) {
        return this.tenantService.obtenerTenantPorId(id);
    }
    crear(crearTenantDto) {
        return this.tenantService.crearTenant(crearTenantDto);
    }
    actualizar(id, actualizarTenantDto) {
        return this.tenantService.actualizarTenant(id, actualizarTenantDto);
    }
    toggleActivo(id) {
        return this.tenantService.toggleActivo(id);
    }
    eliminar(id) {
        return this.tenantService.eliminarTenant(id);
    }
};
exports.TenantController = TenantController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('pagina')),
    __param(1, (0, common_1.Query)('limite')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], TenantController.prototype, "obtenerTodos", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TenantController.prototype, "obtenerPorId", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [crear_tenant_dto_1.CrearTenantDto]),
    __metadata("design:returntype", void 0)
], TenantController.prototype, "crear", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, actualizar_tenant_dto_1.ActualizarTenantDto]),
    __metadata("design:returntype", void 0)
], TenantController.prototype, "actualizar", null);
__decorate([
    (0, common_1.Patch)(':id/toggle-activo'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TenantController.prototype, "toggleActivo", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TenantController.prototype, "eliminar", null);
exports.TenantController = TenantController = __decorate([
    (0, common_1.Controller)('tenants'),
    (0, common_1.UseGuards)(jwt_autenticacion_guard_1.GuardJwtAutenticacion, super_admin_guard_1.SuperAdminGuard),
    __metadata("design:paramtypes", [tenant_service_1.TenantService])
], TenantController);
//# sourceMappingURL=tenant.controller.js.map
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
exports.ConfiguracionController = void 0;
const common_1 = require("@nestjs/common");
const tenant_service_1 = require("./tenant.service");
const jwt_autenticacion_guard_1 = require("../common/guards/jwt-autenticacion.guard");
let ConfiguracionController = class ConfiguracionController {
    tenantService;
    constructor(tenantService) {
        this.tenantService = tenantService;
    }
    async obtenerConfiguracion(req) {
        const tenant = req.tenant;
        return {
            exito: true,
            mensaje: 'Configuración obtenida',
            datos: {
                nombreEntidad: tenant.nombreEntidad,
                logoUrl: tenant.logoUrl,
                colorPrimario: tenant.colorPrimario,
                colorSecundario: tenant.colorSecundario,
            },
        };
    }
    async actualizarConfiguracion(req, body) {
        const usuario = req.user;
        if (usuario.rol !== 'administrador') {
            return {
                exito: false,
                mensaje: 'Acceso denegado. Se requiere rol de administrador.',
            };
        }
        const tenant = req.tenant;
        const configuracionActualizada = await this.tenantService.actualizarBranding(tenant.id, body);
        return {
            exito: true,
            mensaje: 'Configuración actualizada exitosamente',
            datos: {
                nombreEntidad: configuracionActualizada.nombreEntidad,
                logoUrl: configuracionActualizada.logoUrl,
                colorPrimario: configuracionActualizada.colorPrimario,
                colorSecundario: configuracionActualizada.colorSecundario,
            },
        };
    }
};
exports.ConfiguracionController = ConfiguracionController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ConfiguracionController.prototype, "obtenerConfiguracion", null);
__decorate([
    (0, common_1.Patch)(),
    (0, common_1.UseGuards)(jwt_autenticacion_guard_1.GuardJwtAutenticacion),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ConfiguracionController.prototype, "actualizarConfiguracion", null);
exports.ConfiguracionController = ConfiguracionController = __decorate([
    (0, common_1.Controller)('configuracion'),
    __metadata("design:paramtypes", [tenant_service_1.TenantService])
], ConfiguracionController);
//# sourceMappingURL=configuracion.controller.js.map
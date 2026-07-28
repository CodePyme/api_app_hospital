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
var TenantMiddleware_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantMiddleware = void 0;
const common_1 = require("@nestjs/common");
const tenant_service_1 = require("./tenant.service");
const tenant_connection_manager_1 = require("./tenant-connection.manager");
let TenantMiddleware = TenantMiddleware_1 = class TenantMiddleware {
    tenantService;
    connectionManager;
    logger = new common_1.Logger(TenantMiddleware_1.name);
    constructor(tenantService, connectionManager) {
        this.tenantService = tenantService;
        this.connectionManager = connectionManager;
    }
    async use(req, res, next) {
        const dominioRaw = req.headers['x-tenant-domain'] ||
            req.headers['host'] ||
            '';
        const dominio = dominioRaw.split(':')[0].toLowerCase().trim();
        if (!dominio) {
            throw new common_1.NotFoundException('No se pudo determinar el tenant: dominio no proporcionado');
        }
        this.logger.debug(`🏢 Resolviendo tenant para dominio: ${dominio}`);
        const tenant = await this.tenantService.buscarPorDominio(dominio);
        if (!tenant) {
            throw new common_1.NotFoundException(`Tenant no encontrado para el dominio: ${dominio}`);
        }
        if (!tenant.activo) {
            throw new common_1.NotFoundException(`El tenant para el dominio ${dominio} está inactivo`);
        }
        const conexion = await this.connectionManager.obtenerConexion(tenant);
        req.tenantDominio = dominio;
        req.tenantConexion = conexion;
        req.tenant = tenant;
        next();
    }
};
exports.TenantMiddleware = TenantMiddleware;
exports.TenantMiddleware = TenantMiddleware = TenantMiddleware_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [tenant_service_1.TenantService,
        tenant_connection_manager_1.TenantConnectionManager])
], TenantMiddleware);
//# sourceMappingURL=tenant.middleware.js.map
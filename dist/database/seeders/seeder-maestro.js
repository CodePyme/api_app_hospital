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
var SeederMaestro_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeederMaestro = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const tenant_entity_1 = require("../../tenants/tenant.entity");
const tenant_connection_manager_1 = require("../../tenants/tenant-connection.manager");
let SeederMaestro = SeederMaestro_1 = class SeederMaestro {
    repositorioTenant;
    connectionManager;
    logger = new common_1.Logger(SeederMaestro_1.name);
    constructor(repositorioTenant, connectionManager) {
        this.repositorioTenant = repositorioTenant;
        this.connectionManager = connectionManager;
    }
    async onApplicationBootstrap() {
        await this.garantizarTenantDesarrollo();
        if (process.env.ENTORNO === 'production' || process.env.CORS_ORIGINS?.includes('portal.runasalud.com')) {
            await this.garantizarTenantProduccion();
        }
    }
    async garantizarTenantDesarrollo() {
        try {
            const dominio = process.env.TENANT_DEV_DOMINIO ?? 'localhost';
            let tenant = await this.repositorioTenant.findOne({
                where: { dominio },
            });
            if (!tenant) {
                this.logger.log('🌱 Creando tenant de desarrollo en BD maestra...');
                tenant = this.repositorioTenant.create({
                    nombre: process.env.TENANT_DEV_NOMBRE ?? 'Clínica Local (Desarrollo)',
                    dominio,
                    slug: process.env.TENANT_DEV_SLUG ?? 'localhost',
                    dbHost: process.env.TENANT_DEV_DB_HOST ?? process.env.DB_HOST ?? '127.0.0.1',
                    dbPort: parseInt(process.env.TENANT_DEV_DB_PORT ?? process.env.DB_PORT ?? '5432', 10),
                    dbUsername: process.env.TENANT_DEV_DB_USERNAME ?? process.env.DB_USERNAME ?? '',
                    dbPassword: process.env.TENANT_DEV_DB_PASSWORD ?? process.env.DB_PASSWORD ?? '',
                    dbDatabase: process.env.TENANT_DEV_DB_DATABASE ?? process.env.DB_DATABASE ?? 'portal_paciente',
                    activo: true,
                });
                await this.repositorioTenant.save(tenant);
                this.logger.log(`✅ Tenant de desarrollo creado: ${tenant.nombre} → BD: ${tenant.dbDatabase}`);
            }
            else {
                this.logger.log(`✔ Tenant de desarrollo ya existe: ${tenant.nombre} → BD: ${tenant.dbDatabase}`);
            }
            await this.connectionManager.obtenerConexion(tenant);
            this.logger.log('✅ Tablas del tenant de desarrollo sincronizadas');
        }
        catch (error) {
            this.logger.error('❌ Error en SeederMaestro (Desarrollo)', error);
        }
    }
    async garantizarTenantProduccion() {
        try {
            const dominio = 'portal.runasalud.com';
            let tenant = await this.repositorioTenant.findOne({ where: { dominio } });
            if (!tenant) {
                this.logger.log('🌱 Creando tenant de producción en BD maestra...');
                tenant = this.repositorioTenant.create({
                    nombre: 'Portal Paciente Runasalud',
                    dominio,
                    slug: 'runasalud',
                    dbHost: process.env.DB_HOST ?? '127.0.0.1',
                    dbPort: parseInt(process.env.DB_PORT ?? '5432', 10),
                    dbUsername: process.env.DB_USERNAME ?? '',
                    dbPassword: process.env.DB_PASSWORD ?? '',
                    dbDatabase: process.env.DB_DATABASE ?? 'portal_paciente',
                    activo: true,
                });
                await this.repositorioTenant.save(tenant);
                this.logger.log(`✅ Tenant de producción creado: ${tenant.nombre}`);
            }
            else {
                this.logger.log(`✔ Tenant de producción ya existe: ${tenant.nombre}`);
            }
            await this.connectionManager.obtenerConexion(tenant);
            this.logger.log('✅ Tablas del tenant de producción sincronizadas');
        }
        catch (error) {
            this.logger.error('❌ Error en SeederMaestro (Producción)', error);
        }
    }
};
exports.SeederMaestro = SeederMaestro;
exports.SeederMaestro = SeederMaestro = SeederMaestro_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(tenant_entity_1.Tenant)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        tenant_connection_manager_1.TenantConnectionManager])
], SeederMaestro);
//# sourceMappingURL=seeder-maestro.js.map
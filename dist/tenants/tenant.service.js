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
var TenantService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const tenant_entity_1 = require("./tenant.entity");
let TenantService = TenantService_1 = class TenantService {
    repositorioTenant;
    logger = new common_1.Logger(TenantService_1.name);
    constructor(repositorioTenant) {
        this.repositorioTenant = repositorioTenant;
    }
    async crearTenant(crearTenantDto) {
        const dominioExistente = await this.repositorioTenant.findOne({
            where: { dominio: crearTenantDto.dominio },
        });
        if (dominioExistente) {
            throw new common_1.ConflictException(`Ya existe un tenant con el dominio "${crearTenantDto.dominio}"`);
        }
        const slugExistente = await this.repositorioTenant.findOne({
            where: { slug: crearTenantDto.slug },
        });
        if (slugExistente) {
            throw new common_1.ConflictException(`Ya existe un tenant con el slug "${crearTenantDto.slug}"`);
        }
        const nuevoTenant = this.repositorioTenant.create({
            ...crearTenantDto,
            activo: crearTenantDto.activo ?? true,
        });
        const tenantGuardado = await this.repositorioTenant.save(nuevoTenant);
        this.logger.log(`✅ Tenant creado: ${tenantGuardado.nombre} (${tenantGuardado.dominio})`);
        return {
            exito: true,
            mensaje: 'Tenant creado exitosamente',
            datos: tenantGuardado,
        };
    }
    async obtenerTodosTenants(pagina = 1, limite = 10) {
        const salto = (pagina - 1) * limite;
        const [listaTenants, total] = await this.repositorioTenant.findAndCount({
            order: { creadoEn: 'DESC' },
            skip: salto,
            take: limite,
        });
        return {
            exito: true,
            mensaje: 'Lista de tenants obtenida exitosamente',
            datos: listaTenants,
            total,
            pagina,
            limite,
            totalPaginas: Math.ceil(total / limite),
        };
    }
    async obtenerTenantPorId(id) {
        const tenant = await this.repositorioTenant.findOne({ where: { id } });
        if (!tenant) {
            throw new common_1.NotFoundException(`Tenant con ID ${id} no encontrado`);
        }
        return {
            exito: true,
            mensaje: 'Tenant obtenido exitosamente',
            datos: tenant,
        };
    }
    async buscarPorDominio(dominio) {
        return this.repositorioTenant.findOne({
            where: { dominio, activo: true },
        });
    }
    async actualizarTenant(id, actualizarTenantDto) {
        const respuesta = await this.obtenerTenantPorId(id);
        const tenant = respuesta.datos;
        if (actualizarTenantDto.dominio && actualizarTenantDto.dominio !== tenant.dominio) {
            const dominioExistente = await this.repositorioTenant.findOne({
                where: { dominio: actualizarTenantDto.dominio },
            });
            if (dominioExistente) {
                throw new common_1.ConflictException(`Ya existe un tenant con el dominio "${actualizarTenantDto.dominio}"`);
            }
        }
        if (actualizarTenantDto.slug && actualizarTenantDto.slug !== tenant.slug) {
            const slugExistente = await this.repositorioTenant.findOne({
                where: { slug: actualizarTenantDto.slug },
            });
            if (slugExistente) {
                throw new common_1.ConflictException(`Ya existe un tenant con el slug "${actualizarTenantDto.slug}"`);
            }
        }
        Object.assign(tenant, actualizarTenantDto);
        const tenantActualizado = await this.repositorioTenant.save(tenant);
        return {
            exito: true,
            mensaje: 'Tenant actualizado exitosamente',
            datos: tenantActualizado,
        };
    }
    async toggleActivo(id) {
        const respuesta = await this.obtenerTenantPorId(id);
        const tenant = respuesta.datos;
        tenant.activo = !tenant.activo;
        const tenantActualizado = await this.repositorioTenant.save(tenant);
        return {
            exito: true,
            mensaje: `Tenant ${tenantActualizado.activo ? 'activado' : 'desactivado'} exitosamente`,
            datos: tenantActualizado,
        };
    }
    async eliminarTenant(id) {
        const respuesta = await this.obtenerTenantPorId(id);
        const tenant = respuesta.datos;
        await this.repositorioTenant.remove(tenant);
        this.logger.warn(`🗑️ Tenant eliminado: ${tenant.nombre} (${tenant.dominio})`);
        return {
            exito: true,
            mensaje: 'Tenant eliminado exitosamente',
        };
    }
    async actualizarBranding(id, branding) {
        const respuesta = await this.obtenerTenantPorId(id);
        const tenant = respuesta.datos;
        if (branding.nombreEntidad)
            tenant.nombreEntidad = branding.nombreEntidad;
        if (branding.logoUrl !== undefined)
            tenant.logoUrl = branding.logoUrl;
        if (branding.colorPrimario)
            tenant.colorPrimario = branding.colorPrimario;
        if (branding.colorSecundario)
            tenant.colorSecundario = branding.colorSecundario;
        return this.repositorioTenant.save(tenant);
    }
};
exports.TenantService = TenantService;
exports.TenantService = TenantService = TenantService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(tenant_entity_1.Tenant)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], TenantService);
//# sourceMappingURL=tenant.service.js.map
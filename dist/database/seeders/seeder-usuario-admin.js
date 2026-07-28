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
var SeederUsuarioAdmin_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeederUsuarioAdmin = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = __importStar(require("bcrypt"));
const usuario_entity_1 = require("../../autenticacion/entities/usuario.entity");
const tenant_service_1 = require("../../tenants/tenant.service");
const tenant_connection_manager_1 = require("../../tenants/tenant-connection.manager");
let SeederUsuarioAdmin = SeederUsuarioAdmin_1 = class SeederUsuarioAdmin {
    tenantService;
    connectionManager;
    logger = new common_1.Logger(SeederUsuarioAdmin_1.name);
    CORREO_ADMIN = 'admin@codepyme.com';
    CONTRASENA_ADMIN = 'admin123';
    RONDAS_HASH = 10;
    constructor(tenantService, connectionManager) {
        this.tenantService = tenantService;
        this.connectionManager = connectionManager;
    }
    async onApplicationBootstrap() {
        await this.sembrarUsuarioAdmin();
    }
    async sembrarUsuarioAdmin() {
        try {
            const tenantsPaginados = await this.tenantService.obtenerTodosTenants(1, 1000);
            const tenants = tenantsPaginados.datos;
            for (const tenant of tenants) {
                if (!tenant.activo)
                    continue;
                try {
                    const conexion = await this.connectionManager.obtenerConexion(tenant);
                    const repositorioUsuario = conexion.getRepository(usuario_entity_1.Usuario);
                    const adminExistente = await repositorioUsuario.findOne({
                        where: { correoElectronico: this.CORREO_ADMIN },
                    });
                    if (adminExistente) {
                        this.logger.log(`✔ Usuario admin ya existe en tenant: ${tenant.nombre}`);
                        continue;
                    }
                    const contrasenaHasheada = await bcrypt.hash(this.CONTRASENA_ADMIN, this.RONDAS_HASH);
                    const nuevoAdmin = repositorioUsuario.create({
                        nombres: 'Administrador',
                        apellidos: 'Sistema',
                        correoElectronico: this.CORREO_ADMIN,
                        contrasena: contrasenaHasheada,
                        rol: usuario_entity_1.RolUsuario.ADMINISTRADOR,
                        activo: true,
                    });
                    await repositorioUsuario.save(nuevoAdmin);
                    this.logger.log(`✅ Usuario admin creado en tenant: ${tenant.nombre}`);
                }
                catch (errorTenant) {
                    this.logger.error(`❌ Error al sembrar admin en tenant ${tenant.nombre}`, errorTenant);
                }
            }
        }
        catch (error) {
            this.logger.error('❌ Error al obtener tenants para sembrado', error);
        }
    }
};
exports.SeederUsuarioAdmin = SeederUsuarioAdmin;
exports.SeederUsuarioAdmin = SeederUsuarioAdmin = SeederUsuarioAdmin_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [tenant_service_1.TenantService,
        tenant_connection_manager_1.TenantConnectionManager])
], SeederUsuarioAdmin);
//# sourceMappingURL=seeder-usuario-admin.js.map
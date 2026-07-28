"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var TenantConnectionManager_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantConnectionManager = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const usuario_entity_1 = require("../autenticacion/entities/usuario.entity");
const paciente_entity_1 = require("../pacientes/entities/paciente.entity");
const cita_entity_1 = require("../citas/entities/cita.entity");
const ENTIDADES_TENANT = [usuario_entity_1.Usuario, paciente_entity_1.Paciente, cita_entity_1.Cita];
let TenantConnectionManager = TenantConnectionManager_1 = class TenantConnectionManager {
    logger = new common_1.Logger(TenantConnectionManager_1.name);
    conexiones = new Map();
    async obtenerConexion(tenant) {
        const dominio = tenant.dominio;
        if (this.conexiones.has(dominio)) {
            const conexionExistente = this.conexiones.get(dominio);
            if (conexionExistente.isInitialized) {
                return conexionExistente;
            }
        }
        this.logger.log(`🔌 Creando conexión para tenant: ${tenant.nombre} (${dominio})`);
        const opciones = {
            type: 'postgres',
            host: tenant.dbHost,
            port: tenant.dbPort,
            username: tenant.dbUsername,
            password: tenant.dbPassword,
            database: tenant.dbDatabase,
            entities: ENTIDADES_TENANT,
            synchronize: process.env.DB_SINCRONIZAR === 'true',
            logging: process.env.DB_REGISTRO === 'true',
        };
        const nuevaConexion = new typeorm_1.DataSource(opciones);
        await nuevaConexion.initialize();
        this.conexiones.set(dominio, nuevaConexion);
        this.logger.log(`✅ Conexión establecida para tenant: ${tenant.nombre}`);
        return nuevaConexion;
    }
    async onModuleDestroy() {
        this.logger.log('🔌 Cerrando conexiones de tenants...');
        const promesasCierre = Array.from(this.conexiones.values())
            .filter((conexion) => conexion.isInitialized)
            .map((conexion) => conexion.destroy());
        await Promise.all(promesasCierre);
        this.conexiones.clear();
        this.logger.log('✅ Todas las conexiones de tenants cerradas');
    }
    async cerrarConexion(dominio) {
        const conexion = this.conexiones.get(dominio);
        if (conexion?.isInitialized) {
            await conexion.destroy();
            this.conexiones.delete(dominio);
            this.logger.log(`🔌 Conexión cerrada para tenant: ${dominio}`);
        }
    }
    get totalConexionesActivas() {
        return Array.from(this.conexiones.values()).filter((c) => c.isInitialized).length;
    }
};
exports.TenantConnectionManager = TenantConnectionManager;
exports.TenantConnectionManager = TenantConnectionManager = TenantConnectionManager_1 = __decorate([
    (0, common_1.Injectable)()
], TenantConnectionManager);
//# sourceMappingURL=tenant-connection.manager.js.map
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const base_de_datos_config_1 = require("./config/base-de-datos.config");
const autenticacion_module_1 = require("./autenticacion/autenticacion.module");
const pacientes_module_1 = require("./pacientes/pacientes.module");
const citas_module_1 = require("./citas/citas.module");
const database_module_1 = require("./database/database.module");
const tenant_module_1 = require("./tenants/tenant.module");
const tenant_middleware_1 = require("./tenants/tenant.middleware");
let AppModule = class AppModule {
    configure(consumer) {
        consumer
            .apply(tenant_middleware_1.TenantMiddleware)
            .forRoutes('*');
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [base_de_datos_config_1.configuracionBaseDeDatos],
                envFilePath: '.env',
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configuracionServicio) => ({
                    type: 'postgres',
                    host: configuracionServicio.get('DB_HOST'),
                    port: configuracionServicio.get('DB_PORT'),
                    username: configuracionServicio.get('DB_USERNAME'),
                    password: configuracionServicio.get('DB_PASSWORD'),
                    database: configuracionServicio.get('DB_DATABASE'),
                    synchronize: configuracionServicio.get('DB_SINCRONIZAR') === 'true',
                    logging: configuracionServicio.get('DB_REGISTRO') === 'true',
                    autoLoadEntities: true,
                }),
                inject: [config_1.ConfigService],
            }),
            autenticacion_module_1.AutenticacionModule,
            pacientes_module_1.PacientesModule,
            citas_module_1.CitasModule,
            database_module_1.DatabaseModule,
            tenant_module_1.TenantModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map
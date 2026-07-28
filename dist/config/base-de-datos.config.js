"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configuracionBaseDeDatos = void 0;
const config_1 = require("@nestjs/config");
exports.configuracionBaseDeDatos = (0, config_1.registerAs)('baseDeDatos', () => ({
    type: 'postgres',
    host: process.env.DB_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'portal_paciente',
    synchronize: process.env.DB_SINCRONIZAR === 'true',
    logging: process.env.DB_REGISTRO === 'true',
    autoLoadEntities: true,
}));
//# sourceMappingURL=base-de-datos.config.js.map
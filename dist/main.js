"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
async function iniciarAplicacion() {
    const aplicacion = await core_1.NestFactory.create(app_module_1.AppModule);
    aplicacion.setGlobalPrefix('api/v1');
    aplicacion.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    const origenesPermitidos = [
        /^https?:\/\/localhost(:\d+)?$/,
        /^https?:\/\/127\.0\.0\.1(:\d+)?$/,
        /^https?:\/\/.*\.runasalud\.com$/,
        /^https?:\/\/.*\.codepyme\.io$/,
    ];
    aplicacion.enableCors({
        origin: (origin, callback) => {
            if (!origin)
                return callback(null, true);
            const permitido = origenesPermitidos.some((patron) => patron.test(origin));
            if (permitido) {
                callback(null, true);
            }
            else {
                callback(new Error(`CORS: Origen no permitido → ${origin}`));
            }
        },
        methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Accept', 'Authorization', 'X-Tenant-Domain'],
        credentials: true,
        preflightContinue: false,
        optionsSuccessStatus: 204,
    });
    const puerto = process.env.PUERTO || 3000;
    await aplicacion.listen(puerto);
    console.log(`🚀 API Portal Paciente ejecutándose en: http://localhost:${puerto}/api/v1`);
}
iniciarAplicacion();
//# sourceMappingURL=main.js.map
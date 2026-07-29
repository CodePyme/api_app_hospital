"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
const logger = new common_1.Logger('Bootstrap');
function obtenerOrigenesPermitidos() {
    const origenesEnv = process.env.CORS_ORIGINS;
    if (!origenesEnv)
        return true;
    return origenesEnv.split(',').map((o) => o.trim()).filter(Boolean);
}
async function iniciarAplicacion() {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔍 DIAGNÓSTICO DE CONFIGURACIÓN');
    console.log(`   DB_HOST     : ${process.env.DB_HOST ?? '(no definido)'}`);
    console.log(`   DB_PORT     : ${process.env.DB_PORT ?? '(no definido)'}`);
    console.log(`   DB_DATABASE : ${process.env.DB_DATABASE ?? '(no definido)'}`);
    console.log(`   DB_USERNAME : ${process.env.DB_USERNAME ?? '(no definido)'}`);
    console.log(`   DB_PASSWORD : ${process.env.DB_PASSWORD ? '***' : '(no definido)'}`);
    console.log(`   ENTORNO     : ${process.env.ENTORNO ?? '(no definido)'}`);
    console.log(`   CORS_ORIGINS: ${process.env.CORS_ORIGINS ?? '(no definido - permite todo)'}`);
    console.log(`   CWD         : ${process.cwd()}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    const aplicacion = await core_1.NestFactory.create(app_module_1.AppModule);
    const origenesPermitidos = obtenerOrigenesPermitidos();
    aplicacion.use((req, res, next) => {
        const origin = req.headers.origin;
        const origenAutorizado = origenesPermitidos === true ||
            (Array.isArray(origenesPermitidos) && origin && origenesPermitidos.includes(origin));
        if (origenAutorizado && origin) {
            res.header('Access-Control-Allow-Origin', origin);
            res.header('Vary', 'Origin');
        }
        else if (origenesPermitidos === true) {
            res.header('Access-Control-Allow-Origin', '*');
        }
        res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Accept, Authorization, X-Tenant-Domain');
        res.header('Access-Control-Max-Age', '86400');
        if (req.method === 'OPTIONS') {
            res.status(204).end();
            return;
        }
        next();
    });
    aplicacion.setGlobalPrefix('api/v1');
    aplicacion.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    aplicacion.enableCors({
        origin: origenesPermitidos,
        methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Accept', 'Authorization', 'X-Tenant-Domain'],
        credentials: false,
    });
    const puerto = process.env.PUERTO || 3000;
    await aplicacion.listen(puerto);
    const entorno = process.env.ENTORNO || 'development';
    logger.log(`🚀 API ejecutándose en: http://localhost:${puerto}/api/v1`);
    logger.log(`🌍 Entorno: ${entorno}`);
    logger.log(`🔐 CORS: ${Array.isArray(origenesPermitidos) ? origenesPermitidos.join(', ') : 'todos los orígenes (*)'}`);
}
iniciarAplicacion();
//# sourceMappingURL=main.js.map
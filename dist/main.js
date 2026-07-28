"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
async function iniciarAplicacion() {
    const aplicacion = await core_1.NestFactory.create(app_module_1.AppModule);
    aplicacion.use((req, res, next) => {
        const origin = req.headers.origin || '*';
        res.header('Access-Control-Allow-Origin', origin);
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
        origin: true,
        methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Accept', 'Authorization', 'X-Tenant-Domain'],
        credentials: false,
    });
    const puerto = process.env.PUERTO || 3000;
    await aplicacion.listen(puerto);
    console.log(`🚀 API Portal Paciente ejecutándose en: http://localhost:${puerto}/api/v1`);
}
iniciarAplicacion();
//# sourceMappingURL=main.js.map
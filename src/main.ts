import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function iniciarAplicacion() {
  const aplicacion = await NestFactory.create(AppModule);

  // Prefijo global para todas las rutas de la API
  aplicacion.setGlobalPrefix('api/v1');

  // Pipe global de validación de DTOs
  aplicacion.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Habilitar CORS - permite el frontend de cualquier subdominio o localhost
  const origenesPermitidos = [
    /^https?:\/\/localhost(:\d+)?$/,          // localhost (cualquier puerto)
    /^https?:\/\/127\.0\.0\.1(:\d+)?$/,       // 127.0.0.1
    /^https?:\/\/.*\.runasalud\.com$/,         // Subdominio de runasalud.com
    /^https?:\/\/.*\.codepyme\.io$/,           // Subdominio de codepyme.io
  ];

  aplicacion.enableCors({
    origin: (origin, callback) => {
      // Permite peticiones sin origin (Postman, mobile apps, server-to-server)
      if (!origin) return callback(null, true);
      // Verifica contra la lista de orígenes permitidos
      const permitido = origenesPermitidos.some((patron) => patron.test(origin));
      if (permitido) {
        callback(null, true);
      } else {
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

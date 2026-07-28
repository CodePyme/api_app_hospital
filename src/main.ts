import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { Request, Response, NextFunction } from 'express';

async function iniciarAplicacion() {
  const aplicacion = await NestFactory.create(AppModule);

  // ─── CORS MIDDLEWARE (nivel Express, antes del pipeline de Nest) ────────────
  // Esto se ejecuta ANTES que Nginx pueda interferir con los headers de CORS.
  // Es la solución más confiable cuando hay un reverse proxy (Nginx, Apache, etc.)
  aplicacion.use((req: Request, res: Response, next: NextFunction) => {
    const origin = req.headers.origin || '*';
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Accept, Authorization, X-Tenant-Domain');
    res.header('Access-Control-Max-Age', '86400'); // 24 horas de cache del preflight

    // Responder inmediatamente las peticiones OPTIONS (preflight)
    if (req.method === 'OPTIONS') {
      res.status(204).end();
      return;
    }
    next();
  });
  // ───────────────────────────────────────────────────────────────────────────

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

  // enableCors de Nest como capa secundaria de seguridad
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


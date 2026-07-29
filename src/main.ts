import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { Request, Response, NextFunction } from 'express';

const logger = new Logger('Bootstrap');

/**
 * Parsea la variable CORS_ORIGINS del .env.
 * Acepta una lista separada por comas:
 *   CORS_ORIGINS=https://portal.runasalud.com,https://admin.runasalud.com
 * Si no está definida, permite cualquier origen (útil en desarrollo).
 */
function obtenerOrigenesPermitidos(): string[] | boolean {
  const origenesEnv = process.env.CORS_ORIGINS;
  if (!origenesEnv) return true; // dev: permitir todos
  return origenesEnv.split(',').map((o) => o.trim()).filter(Boolean);
}

async function iniciarAplicacion() {
  const aplicacion = await NestFactory.create(AppModule);

  const origenesPermitidos = obtenerOrigenesPermitidos();

  // ─── CORS MIDDLEWARE (nivel Express, antes del pipeline de Nest) ────────────
  // Responde los preflight OPTIONS antes de que cualquier guard/middleware de Nest
  // pueda bloquearlos. Crítico cuando hay un reverse proxy (Nginx, PM2, etc.)
  aplicacion.use((req: Request, res: Response, next: NextFunction) => {
    const origin = req.headers.origin;

    // Verificar si el origen está permitido
    const origenAutorizado =
      origenesPermitidos === true ||
      (Array.isArray(origenesPermitidos) && origin && origenesPermitidos.includes(origin));

    if (origenAutorizado && origin) {
      res.header('Access-Control-Allow-Origin', origin);
      res.header('Vary', 'Origin');
    } else if (origenesPermitidos === true) {
      res.header('Access-Control-Allow-Origin', '*');
    }

    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Accept, Authorization, X-Tenant-Domain');
    res.header('Access-Control-Max-Age', '86400'); // 24h cache del preflight

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
  logger.log(
    `🔐 CORS: ${Array.isArray(origenesPermitidos) ? origenesPermitidos.join(', ') : 'todos los orígenes (*)'}`,
  );
}

iniciarAplicacion();



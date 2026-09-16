import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';

const logger = new Logger('Bootstrap'); // Reload .env configs

/**
 * Parsea la variable CORS_ORIGINS del .env.
 * Acepta una lista separada por comas:
 *   CORS_ORIGINS=https://portalpacientesf.codepyme.io,https://admin.runasalud.com
 * Si no está definida, permite cualquier origen (útil en desarrollo).
 */
function obtenerOrigenesPermitidos(): string[] | boolean {
  const origenesEnv = process.env.CORS_ORIGINS;
  if (origenesEnv) {
    return origenesEnv.split(',').map((o) => o.trim()).filter(Boolean);
  }

  const esProduccion = process.env.ENTORNO === 'production' || process.env.ENTORNO === 'prd';
  if (esProduccion) {
    // En producción nunca se abre a todos los orígenes por defecto: si falta la
    // variable, se bloquea el acceso cross-origin hasta que se configure explícitamente.
    logger.warn(
      '⚠️ CORS_ORIGINS no está configurada en producción: se bloquean todos los orígenes cross-origin.',
    );
    return [];
  }

  return true; // dev: permitir todos
}

async function iniciarAplicacion() {
  // ─── DIAGNÓSTICO DE VARIABLES DE ENTORNO ─────────────────────────────────
  // Solo se informa si cada variable está o no configurada; nunca sus valores
  // (host, usuario, etc. son información sensible de infraestructura que no
  // debe quedar en los logs del servidor).
  logger.log('🔍 Diagnóstico de configuración (solo presencia, no valores):');
  logger.log(`   DB_HOST     : ${process.env.DB_HOST ? 'configurado' : 'no definido'}`);
  logger.log(`   DB_PORT     : ${process.env.DB_PORT ? 'configurado' : 'no definido'}`);
  logger.log(`   DB_DATABASE : ${process.env.DB_DATABASE ? 'configurado' : 'no definido'}`);
  logger.log(`   DB_USERNAME : ${process.env.DB_USERNAME ? 'configurado' : 'no definido'}`);
  logger.log(`   DB_PASSWORD : ${process.env.DB_PASSWORD ? 'configurado' : 'no definido'}`);
  logger.log(`   ENTORNO     : ${process.env.ENTORNO ?? '(no definido)'}`);
  logger.log(`   CORS_ORIGINS: ${process.env.CORS_ORIGINS ? 'configurado' : 'no definido'}`);
  // ─────────────────────────────────────────────────────────────────────────

  const aplicacion = await NestFactory.create(AppModule);

  // Habilitar Helmet (Seguridad HTTP)
  aplicacion.use(helmet());

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



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

  // Habilitar CORS - permite todos los orígenes
  // Seguro porque la autenticación usa JWT en header Authorization, no cookies
  aplicacion.enableCors({
    origin: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization', 'X-Tenant-Domain'],
    credentials: false,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  const puerto = process.env.PUERTO || 3000;
  await aplicacion.listen(puerto);

  console.log(`🚀 API Portal Paciente ejecutándose en: http://localhost:${puerto}/api/v1`);
}

iniciarAplicacion();

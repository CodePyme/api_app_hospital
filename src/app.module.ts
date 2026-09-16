import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { configuracionBaseDeDatos } from './config/base-de-datos.config';
import { AutenticacionModule } from './autenticacion/autenticacion.module';
import { PacientesModule } from './pacientes/pacientes.module';
import { CitasModule } from './citas/citas.module';
import { DatabaseModule } from './database/database.module';
import { TenantModule } from './tenants/tenant.module';
import { TenantMiddleware } from './tenants/tenant.middleware';
import { ResultadosModule } from './resultados/resultados.module';

@Module({
  imports: [
    // Límite de peticiones global (Anti-DDoS y Fuerza Bruta)
    ThrottlerModule.forRoot([{
      ttl: 60000, // 1 minuto
      limit: 100, // máximo 100 peticiones por IP por minuto
    }]),

    // Configuración de variables de entorno (disponible globalmente).
    // Si el proceso necesita leer el .env desde una ruta distinta a la carpeta de trabajo
    // (por ejemplo, un despliegue donde el working dir no coincide con la ubicación del .env),
    // se define ENV_FILE_PATH como variable de entorno del propio proceso (no del .env,
    // ya que aún no se ha cargado) al arrancar la app. Así se evita hardcodear rutas de
    // infraestructura específicas del proveedor de hosting en el código fuente.
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuracionBaseDeDatos],
      envFilePath: process.env.ENV_FILE_PATH ? ['.env', process.env.ENV_FILE_PATH] : ['.env'],
    }),

    // Conexión a base de datos PostgreSQL
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configuracionServicio: ConfigService) => ({
        type: 'postgres',
        host: configuracionServicio.get<string>('DB_HOST'),
        port: configuracionServicio.get<number>('DB_PORT'),
        username: configuracionServicio.get<string>('DB_USERNAME'),
        password: configuracionServicio.get<string>('DB_PASSWORD'),
        database: configuracionServicio.get<string>('DB_DATABASE'),
        synchronize: configuracionServicio.get<string>('DB_SINCRONIZAR') === 'true',
        logging: configuracionServicio.get<string>('DB_REGISTRO') === 'true',
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),

    // Módulos de la aplicación
    AutenticacionModule,
    PacientesModule,
    CitasModule,
    DatabaseModule,
    TenantModule,
    ResultadosModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TenantMiddleware)
      .forRoutes('*');
  }
}

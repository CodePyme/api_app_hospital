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
    // Busca el .env en la carpeta de trabajo, y opcionalmente en una ruta extra
    // vía ENV_FILE_PATH (variable del proceso, no del .env) para despliegues donde
    // el working dir no coincide con la ubicación real del .env. En este servidor de
    // Forge el .env vive en la raíz del sitio, no en el directorio de trabajo del
    // proceso (current/), así que se mantiene esa ruta explícita como fallback.
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuracionBaseDeDatos],
      envFilePath: [
        '.env',
        process.env.ENV_FILE_PATH,
        '/home/forge/apiportalpacientesf.codepyme.io/.env',
      ].filter((ruta): ruta is string => Boolean(ruta)),
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

import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configuracionBaseDeDatos } from './config/base-de-datos.config';
import { AutenticacionModule } from './autenticacion/autenticacion.module';
import { PacientesModule } from './pacientes/pacientes.module';
import { CitasModule } from './citas/citas.module';
import { DatabaseModule } from './database/database.module';
import { TenantModule } from './tenants/tenant.module';
import { TenantMiddleware } from './tenants/tenant.middleware';

@Module({
  imports: [
    // Configuración de variables de entorno (disponible globalmente)
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuracionBaseDeDatos],
      envFilePath: '.env',
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
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TenantMiddleware)
      .forRoutes('*');
  }
}

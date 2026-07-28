import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const configuracionBaseDeDatos = registerAs(
  'baseDeDatos',
  (): TypeOrmModuleOptions => ({
    type: 'postgres',
    host: process.env.DB_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'portal_paciente',
    synchronize: process.env.DB_SINCRONIZAR === 'true',
    logging: process.env.DB_REGISTRO === 'true',
    autoLoadEntities: true,
  }),
);

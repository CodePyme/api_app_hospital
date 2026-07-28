import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from '../autenticacion/entities/usuario.entity';
import { SeederUsuarioAdmin } from './seeders/seeder-usuario-admin';

import { TenantModule } from '../tenants/tenant.module';

@Module({
  imports: [TenantModule],
  providers: [SeederUsuarioAdmin],
})
export class DatabaseModule {}

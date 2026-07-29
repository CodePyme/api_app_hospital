import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeederMaestro } from './seeders/seeder-maestro';
import { SeederUsuarioAdmin } from './seeders/seeder-usuario-admin';
import { Tenant } from '../tenants/tenant.entity';
import { TenantModule } from '../tenants/tenant.module';

@Module({
  imports: [
    TenantModule,
    // Necesario para que SeederMaestro pueda inyectar Repository<Tenant>
    TypeOrmModule.forFeature([Tenant]),
  ],
  providers: [
    // SeederMaestro DEBE ir primero: crea el tenant para que
    // SeederUsuarioAdmin lo encuentre al iterar los tenants activos.
    SeederMaestro,
    SeederUsuarioAdmin,
  ],
})
export class DatabaseModule {}

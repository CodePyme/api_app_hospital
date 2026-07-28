import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tenant } from './tenant.entity';
import { TenantService } from './tenant.service';
import { TenantController } from './tenant.controller';
import { ConfiguracionController } from './configuracion.controller';
import { TenantConnectionManager } from './tenant-connection.manager';

@Module({
  imports: [TypeOrmModule.forFeature([Tenant])],
  controllers: [TenantController, ConfiguracionController],
  providers: [TenantService, TenantConnectionManager],
  exports: [TenantService, TenantConnectionManager],
})
export class TenantModule {}

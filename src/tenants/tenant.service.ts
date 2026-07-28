import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tenant } from './tenant.entity';
import { CrearTenantDto } from './dto/crear-tenant.dto';
import { ActualizarTenantDto } from './dto/actualizar-tenant.dto';
import { RespuestaApi, RespuestaPaginada } from '../common/interfaces/respuesta-api.interface';

@Injectable()
export class TenantService {
  private readonly logger = new Logger(TenantService.name);

  constructor(
    @InjectRepository(Tenant)
    private readonly repositorioTenant: Repository<Tenant>,
  ) {}

  async crearTenant(crearTenantDto: CrearTenantDto): Promise<RespuestaApi<Tenant>> {
    // Verificar dominio duplicado
    const dominioExistente = await this.repositorioTenant.findOne({
      where: { dominio: crearTenantDto.dominio },
    });
    if (dominioExistente) {
      throw new ConflictException(`Ya existe un tenant con el dominio "${crearTenantDto.dominio}"`);
    }

    // Verificar slug duplicado
    const slugExistente = await this.repositorioTenant.findOne({
      where: { slug: crearTenantDto.slug },
    });
    if (slugExistente) {
      throw new ConflictException(`Ya existe un tenant con el slug "${crearTenantDto.slug}"`);
    }

    const nuevoTenant = this.repositorioTenant.create({
      ...crearTenantDto,
      activo: crearTenantDto.activo ?? true,
    });

    const tenantGuardado = await this.repositorioTenant.save(nuevoTenant);
    this.logger.log(`✅ Tenant creado: ${tenantGuardado.nombre} (${tenantGuardado.dominio})`);

    return {
      exito: true,
      mensaje: 'Tenant creado exitosamente',
      datos: tenantGuardado,
    };
  }

  async obtenerTodosTenants(
    pagina = 1,
    limite = 10,
  ): Promise<RespuestaPaginada<Tenant>> {
    const salto = (pagina - 1) * limite;

    const [listaTenants, total] = await this.repositorioTenant.findAndCount({
      order: { creadoEn: 'DESC' },
      skip: salto,
      take: limite,
    });

    return {
      exito: true,
      mensaje: 'Lista de tenants obtenida exitosamente',
      datos: listaTenants,
      total,
      pagina,
      limite,
      totalPaginas: Math.ceil(total / limite),
    };
  }

  async obtenerTenantPorId(id: string): Promise<RespuestaApi<Tenant>> {
    const tenant = await this.repositorioTenant.findOne({ where: { id } });

    if (!tenant) {
      throw new NotFoundException(`Tenant con ID ${id} no encontrado`);
    }

    return {
      exito: true,
      mensaje: 'Tenant obtenido exitosamente',
      datos: tenant,
    };
  }

  async buscarPorDominio(dominio: string): Promise<Tenant | null> {
    return this.repositorioTenant.findOne({
      where: { dominio, activo: true },
    });
  }

  async actualizarTenant(
    id: string,
    actualizarTenantDto: ActualizarTenantDto,
  ): Promise<RespuestaApi<Tenant>> {
    const respuesta = await this.obtenerTenantPorId(id);
    const tenant = respuesta.datos!;

    // Verificar duplicado de dominio si cambió
    if (actualizarTenantDto.dominio && actualizarTenantDto.dominio !== tenant.dominio) {
      const dominioExistente = await this.repositorioTenant.findOne({
        where: { dominio: actualizarTenantDto.dominio },
      });
      if (dominioExistente) {
        throw new ConflictException(
          `Ya existe un tenant con el dominio "${actualizarTenantDto.dominio}"`,
        );
      }
    }

    // Verificar duplicado de slug si cambió
    if (actualizarTenantDto.slug && actualizarTenantDto.slug !== tenant.slug) {
      const slugExistente = await this.repositorioTenant.findOne({
        where: { slug: actualizarTenantDto.slug },
      });
      if (slugExistente) {
        throw new ConflictException(
          `Ya existe un tenant con el slug "${actualizarTenantDto.slug}"`,
        );
      }
    }

    Object.assign(tenant, actualizarTenantDto);
    const tenantActualizado = await this.repositorioTenant.save(tenant);

    return {
      exito: true,
      mensaje: 'Tenant actualizado exitosamente',
      datos: tenantActualizado,
    };
  }

  async toggleActivo(id: string): Promise<RespuestaApi<Tenant>> {
    const respuesta = await this.obtenerTenantPorId(id);
    const tenant = respuesta.datos!;
    tenant.activo = !tenant.activo;
    const tenantActualizado = await this.repositorioTenant.save(tenant);

    return {
      exito: true,
      mensaje: `Tenant ${tenantActualizado.activo ? 'activado' : 'desactivado'} exitosamente`,
      datos: tenantActualizado,
    };
  }

  async eliminarTenant(id: string): Promise<RespuestaApi<null>> {
    const respuesta = await this.obtenerTenantPorId(id);
    const tenant = respuesta.datos!;
    await this.repositorioTenant.remove(tenant);
    this.logger.warn(`🗑️ Tenant eliminado: ${tenant.nombre} (${tenant.dominio})`);

    return {
      exito: true,
      mensaje: 'Tenant eliminado exitosamente',
    };
  }

  async actualizarBranding(
    id: string,
    branding: { nombreEntidad?: string; logoUrl?: string; colorPrimario?: string; colorSecundario?: string },
  ): Promise<Tenant> {
    const respuesta = await this.obtenerTenantPorId(id);
    const tenant = respuesta.datos!;

    if (branding.nombreEntidad) tenant.nombreEntidad = branding.nombreEntidad;
    if (branding.logoUrl !== undefined) tenant.logoUrl = branding.logoUrl;
    if (branding.colorPrimario) tenant.colorPrimario = branding.colorPrimario;
    if (branding.colorSecundario) tenant.colorSecundario = branding.colorSecundario;

    return this.repositorioTenant.save(tenant);
  }
}

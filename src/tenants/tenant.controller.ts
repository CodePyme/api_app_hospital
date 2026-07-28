import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { TenantService } from './tenant.service';
import { CrearTenantDto } from './dto/crear-tenant.dto';
import { ActualizarTenantDto } from './dto/actualizar-tenant.dto';
import { GuardJwtAutenticacion } from '../common/guards/jwt-autenticacion.guard';
import { SuperAdminGuard } from './guards/super-admin.guard';

@Controller('tenants')
@UseGuards(GuardJwtAutenticacion, SuperAdminGuard)
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  /**
   * Listar todos los tenants con paginación
   * GET /api/v1/tenants
   */
  @Get()
  obtenerTodos(
    @Query('pagina') pagina = 1,
    @Query('limite') limite = 10,
  ) {
    return this.tenantService.obtenerTodosTenants(+pagina, +limite);
  }

  /**
   * Obtener un tenant por ID
   * GET /api/v1/tenants/:id
   */
  @Get(':id')
  obtenerPorId(@Param('id', ParseUUIDPipe) id: string) {
    return this.tenantService.obtenerTenantPorId(id);
  }

  /**
   * Crear un nuevo tenant
   * POST /api/v1/tenants
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  crear(@Body() crearTenantDto: CrearTenantDto) {
    return this.tenantService.crearTenant(crearTenantDto);
  }

  /**
   * Actualizar datos de un tenant
   * PATCH /api/v1/tenants/:id
   */
  @Patch(':id')
  actualizar(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() actualizarTenantDto: ActualizarTenantDto,
  ) {
    return this.tenantService.actualizarTenant(id, actualizarTenantDto);
  }

  /**
   * Activar o desactivar un tenant
   * PATCH /api/v1/tenants/:id/toggle-activo
   */
  @Patch(':id/toggle-activo')
  toggleActivo(@Param('id', ParseUUIDPipe) id: string) {
    return this.tenantService.toggleActivo(id);
  }

  /**
   * Eliminar un tenant
   * DELETE /api/v1/tenants/:id
   */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  eliminar(@Param('id', ParseUUIDPipe) id: string) {
    return this.tenantService.eliminarTenant(id);
  }
}

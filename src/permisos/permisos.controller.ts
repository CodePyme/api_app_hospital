import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { PermisosService } from './permisos.service';
import { CrearPermisoDto } from './dto/crear-permiso.dto';
import { ActualizarPermisoDto } from './dto/actualizar-permiso.dto';
import { GuardJwtAutenticacion } from '../common/guards/jwt-autenticacion.guard';
import { PermisosGuard } from '../common/guards/permisos.guard';
import { RequierePermisos } from '../common/decorators/permisos.decorator';

@Controller('permisos')
@UseGuards(GuardJwtAutenticacion, PermisosGuard)
export class PermisosController {
  constructor(private readonly permisosService: PermisosService) {}

  @Get()
  @RequierePermisos('permisos.ver', 'roles.ver', 'usuarios.ver')
  async obtenerTodos() {
    return this.permisosService.obtenerTodos();
  }

  @Get('agrupados')
  @RequierePermisos('permisos.ver', 'roles.ver', 'usuarios.ver')
  async obtenerPorModulo() {
    return this.permisosService.obtenerPorModulo();
  }

  @Post('sincronizar')
  @RequierePermisos('permisos.gestionar')
  async sincronizarCatalogo() {
    return this.permisosService.sincronizarCatalogo();
  }

  @Get(':id')
  @RequierePermisos('permisos.ver')
  async obtenerPorId(@Param('id', ParseUUIDPipe) id: string) {
    return this.permisosService.obtenerPorId(id);
  }

  @Post()
  @RequierePermisos('permisos.gestionar')
  async crear(@Body() crearPermisoDto: CrearPermisoDto) {
    return this.permisosService.crear(crearPermisoDto);
  }

  @Put(':id')
  @RequierePermisos('permisos.gestionar')
  async actualizar(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() actualizarPermisoDto: ActualizarPermisoDto,
  ) {
    return this.permisosService.actualizar(id, actualizarPermisoDto);
  }

  @Delete(':id')
  @RequierePermisos('permisos.gestionar')
  async eliminar(@Param('id', ParseUUIDPipe) id: string) {
    return this.permisosService.eliminar(id);
  }
}

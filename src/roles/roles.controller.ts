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
import { RolesService } from './roles.service';
import { CrearRolDto } from './dto/crear-rol.dto';
import { ActualizarRolDto } from './dto/actualizar-rol.dto';
import { GuardJwtAutenticacion } from '../common/guards/jwt-autenticacion.guard';
import { PermisosGuard } from '../common/guards/permisos.guard';
import { RequierePermisos } from '../common/decorators/permisos.decorator';

@Controller('roles')
@UseGuards(GuardJwtAutenticacion, PermisosGuard)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  @RequierePermisos('roles.ver', 'usuarios.ver')
  async obtenerTodos() {
    return this.rolesService.obtenerTodos();
  }

  @Get(':id')
  @RequierePermisos('roles.ver')
  async obtenerPorId(@Param('id', ParseUUIDPipe) id: string) {
    return this.rolesService.obtenerPorId(id);
  }

  @Post()
  @RequierePermisos('roles.crear')
  async crear(@Body() crearRolDto: CrearRolDto) {
    return this.rolesService.crear(crearRolDto);
  }

  @Put(':id')
  @RequierePermisos('roles.editar')
  async actualizar(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() actualizarRolDto: ActualizarRolDto,
  ) {
    return this.rolesService.actualizar(id, actualizarRolDto);
  }

  @Delete(':id')
  @RequierePermisos('roles.eliminar')
  async eliminar(@Param('id', ParseUUIDPipe) id: string) {
    return this.rolesService.eliminar(id);
  }
}

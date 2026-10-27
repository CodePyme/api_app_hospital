import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CrearUsuarioDto } from './dto/crear-usuario.dto';
import { ActualizarUsuarioDto } from './dto/actualizar-usuario.dto';
import { CambiarContrasenaDto } from './dto/cambiar-contrasena.dto';
import { GuardJwtAutenticacion } from '../common/guards/jwt-autenticacion.guard';
import { PermisosGuard } from '../common/guards/permisos.guard';
import { RequierePermisos } from '../common/decorators/permisos.decorator';

@Controller('usuarios')
@UseGuards(GuardJwtAutenticacion, PermisosGuard)
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Get()
  @RequierePermisos('usuarios.ver')
  async obtenerUsuarios(@Query('incluirPacientes') incluirPacientes?: string) {
    const flag = incluirPacientes === 'true';
    return this.usuariosService.obtenerUsuarios(flag);
  }

  @Get(':id')
  @RequierePermisos('usuarios.ver')
  async obtenerPorId(@Param('id', ParseUUIDPipe) id: string) {
    return this.usuariosService.obtenerPorId(id);
  }

  @Post()
  @RequierePermisos('usuarios.crear')
  async crear(@Body() crearUsuarioDto: CrearUsuarioDto) {
    return this.usuariosService.crear(crearUsuarioDto);
  }

  @Put(':id')
  @RequierePermisos('usuarios.editar')
  async actualizar(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() actualizarUsuarioDto: ActualizarUsuarioDto,
  ) {
    return this.usuariosService.actualizar(id, actualizarUsuarioDto);
  }

  @Put(':id/cambiar-contrasena')
  @RequierePermisos('usuarios.editar')
  async cambiarContrasena(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() cambiarContrasenaDto: CambiarContrasenaDto,
  ) {
    return this.usuariosService.cambiarContrasena(id, cambiarContrasenaDto);
  }

  @Delete(':id')
  @RequierePermisos('usuarios.eliminar')
  async eliminar(@Param('id', ParseUUIDPipe) id: string) {
    return this.usuariosService.eliminar(id);
  }
}

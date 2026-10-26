import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { PacientesService } from './pacientes.service';
import { CrearPacienteDto } from './dto/crear-paciente.dto';
import { ActualizarPacienteDto } from './dto/actualizar-paciente.dto';
import { GuardJwtAutenticacion } from '../common/guards/jwt-autenticacion.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RolUsuario } from '../autenticacion/entities/usuario.entity';

const PERSONAL_CLINICO = [RolUsuario.ADMINISTRADOR, RolUsuario.MEDICO, RolUsuario.RECEPCIONISTA];

@UseGuards(GuardJwtAutenticacion, RolesGuard)
@Controller('pacientes')
export class PacientesController {
  constructor(private readonly pacientesService: PacientesService) {}

  @Roles(...PERSONAL_CLINICO)
  @Post()
  async crearPaciente(@Body() crearPacienteDto: CrearPacienteDto) {
    return this.pacientesService.crearPaciente(crearPacienteDto);
  }

  @Roles(...PERSONAL_CLINICO)
  @Get()
  async obtenerTodosPacientes(
    @Query('pagina') pagina?: string,
    @Query('limite') limite?: string,
  ) {
    const numeroPagina = pagina ? parseInt(pagina, 10) : 1;
    const numeroLimite = limite ? parseInt(limite, 10) : 10;
    return this.pacientesService.obtenerTodosPacientes(numeroPagina, numeroLimite);
  }

  @Roles(...PERSONAL_CLINICO)
  @Get('buscar')
  async buscarPacientes(@Query('termino') termino: string) {
    return this.pacientesService.buscarPacientes(termino);
  }

  // Autoconsulta: el propio paciente autenticado consulta sus datos. Sin restricción de rol.
  @Get('mi-perfil')
  async obtenerMiPerfil(@Req() req: Request) {
    return this.pacientesService.obtenerMiPerfil(req.user);
  }

  @Roles(...PERSONAL_CLINICO)
  @Get('episodio/:episodio')
  async consultarPorEpisodio(@Param('episodio') episodio: string) {
    return this.pacientesService.consultarPorEpisodio(episodio);
  }

  @Roles(...PERSONAL_CLINICO)
  @Get(':id')
  async obtenerPacientePorId(@Param('id') id: string) {
    return this.pacientesService.obtenerPacientePorId(id);
  }

  @Roles(...PERSONAL_CLINICO)
  @Patch(':id')
  async actualizarPaciente(
    @Param('id') id: string,
    @Body() actualizarPacienteDto: ActualizarPacienteDto,
  ) {
    return this.pacientesService.actualizarPaciente(id, actualizarPacienteDto);
  }

  @Roles(RolUsuario.ADMINISTRADOR)
  @Delete(':id')
  async eliminarPaciente(@Param('id') id: string) {
    return this.pacientesService.eliminarPaciente(id);
  }
}

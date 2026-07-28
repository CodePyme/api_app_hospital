import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PacientesService } from './pacientes.service';
import { CrearPacienteDto } from './dto/crear-paciente.dto';
import { ActualizarPacienteDto } from './dto/actualizar-paciente.dto';
import { GuardJwtAutenticacion } from '../common/guards/jwt-autenticacion.guard';

@UseGuards(GuardJwtAutenticacion)
@Controller('pacientes')
export class PacientesController {
  constructor(private readonly pacientesService: PacientesService) {}

  @Post()
  async crearPaciente(@Body() crearPacienteDto: CrearPacienteDto) {
    return this.pacientesService.crearPaciente(crearPacienteDto);
  }

  @Get()
  async obtenerTodosPacientes(
    @Query('pagina') pagina?: string,
    @Query('limite') limite?: string,
  ) {
    const numeroPagina = pagina ? parseInt(pagina, 10) : 1;
    const numeroLimite = limite ? parseInt(limite, 10) : 10;
    return this.pacientesService.obtenerTodosPacientes(numeroPagina, numeroLimite);
  }

  @Get('buscar')
  async buscarPacientes(@Query('termino') termino: string) {
    return this.pacientesService.buscarPacientes(termino);
  }

  @Get(':id')
  async obtenerPacientePorId(@Param('id') id: string) {
    return this.pacientesService.obtenerPacientePorId(id);
  }

  @Patch(':id')
  async actualizarPaciente(
    @Param('id') id: string,
    @Body() actualizarPacienteDto: ActualizarPacienteDto,
  ) {
    return this.pacientesService.actualizarPaciente(id, actualizarPacienteDto);
  }

  @Delete(':id')
  async eliminarPaciente(@Param('id') id: string) {
    return this.pacientesService.eliminarPaciente(id);
  }
}

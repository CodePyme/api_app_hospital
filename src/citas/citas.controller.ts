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
import { CitasService } from './citas.service';
import { CrearCitaDto } from './dto/crear-cita.dto';
import { ActualizarCitaDto } from './dto/actualizar-cita.dto';
import { GuardJwtAutenticacion } from '../common/guards/jwt-autenticacion.guard';

@UseGuards(GuardJwtAutenticacion)
@Controller('citas')
export class CitasController {
  constructor(private readonly citasService: CitasService) {}

  @Post()
  async crearCita(@Body() crearCitaDto: CrearCitaDto) {
    return this.citasService.crearCita(crearCitaDto);
  }

  @Get()
  async obtenerTodasLasCitas(
    @Query('pagina') pagina?: string,
    @Query('limite') limite?: string,
  ) {
    const numeroPagina = pagina ? parseInt(pagina, 10) : 1;
    const numeroLimite = limite ? parseInt(limite, 10) : 10;
    return this.citasService.obtenerTodasLasCitas(numeroPagina, numeroLimite);
  }

  @Get('paciente/:pacienteId')
  async obtenerCitasPorPaciente(@Param('pacienteId') pacienteId: string) {
    return this.citasService.obtenerCitasPorPaciente(pacienteId);
  }

  @Get(':id')
  async obtenerCitaPorId(@Param('id') id: string) {
    return this.citasService.obtenerCitaPorId(id);
  }

  @Patch(':id')
  async actualizarCita(
    @Param('id') id: string,
    @Body() actualizarCitaDto: ActualizarCitaDto,
  ) {
    return this.citasService.actualizarCita(id, actualizarCitaDto);
  }

  @Patch(':id/cancelar')
  async cancelarCita(@Param('id') id: string) {
    return this.citasService.cancelarCita(id);
  }

  @Delete(':id')
  async eliminarCita(@Param('id') id: string) {
    return this.citasService.eliminarCita(id);
  }
}

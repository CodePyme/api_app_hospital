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
import { CitasService } from './citas.service';
import { CrearCitaDto } from './dto/crear-cita.dto';
import { ActualizarCitaDto } from './dto/actualizar-cita.dto';
import { CancelarCitaDto } from './dto/cancelar-cita.dto';
import { GuardJwtAutenticacion } from '../common/guards/jwt-autenticacion.guard';

@UseGuards(GuardJwtAutenticacion)
@Controller('citas')
export class CitasController {
  constructor(private readonly citasService: CitasService) {}

  @Get('mis-citas')
  async obtenerMisCitas(@Req() req: Request) {
    return this.citasService.obtenerMisCitas(req.user);
  }

  @Post('cancelar')
  async cancelarCitaPaciente(
    @Req() req: Request,
    @Body() cancelarCitaDto: CancelarCitaDto,
  ) {
    const ip = req.ip || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];
    return this.citasService.cancelarCitaPaciente(cancelarCitaDto, req.user, ip, userAgent);
  }

  @Post()
  async crearCita(@Body() crearCitaDto: CrearCitaDto) {
    return this.citasService.crearCita(crearCitaDto);
  }

  @Get()
  async obtenerTodasLasCitas(
    @Req() req: Request,
    @Query('pagina') pagina?: string,
    @Query('limite') limite?: string,
  ) {
    const numeroPagina = pagina ? parseInt(pagina, 10) : 1;
    const numeroLimite = limite ? parseInt(limite, 10) : 10;
    return this.citasService.obtenerTodasLasCitas(numeroPagina, numeroLimite, req.user);
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

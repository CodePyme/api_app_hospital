import {
  Injectable,
  NotFoundException,
  Inject,
  Scope,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import type { Request } from 'express';
import { Cita, EstadoCita } from './entities/cita.entity';
import { CrearCitaDto } from './dto/crear-cita.dto';
import { ActualizarCitaDto } from './dto/actualizar-cita.dto';
import { RespuestaApi, RespuestaPaginada } from '../common/interfaces/respuesta-api.interface';
import { PacientesService } from '../pacientes/pacientes.service';

@Injectable({ scope: Scope.REQUEST })
export class CitasService {
  constructor(
    @Inject(REQUEST) private readonly request: Request,
    private readonly pacientesService: PacientesService,
  ) {}

  private get repositorioCita() {
    return this.request.tenantConexion!.getRepository(Cita);
  }

  async crearCita(crearCitaDto: CrearCitaDto): Promise<RespuestaApi<Cita>> {
    // Verificar que el paciente existe
    await this.pacientesService.obtenerPacientePorId(crearCitaDto.pacienteId);

    const nuevaCita = this.repositorioCita.create(crearCitaDto);
    const citaGuardada = await this.repositorioCita.save(nuevaCita);

    return {
      exito: true,
      mensaje: 'Cita creada exitosamente',
      datos: citaGuardada,
    };
  }

  async obtenerTodasLasCitas(
    pagina = 1,
    limite = 10,
  ): Promise<RespuestaPaginada<Cita>> {
    const salto = (pagina - 1) * limite;

    const [listaCitas, total] = await this.repositorioCita.findAndCount({
      relations: { paciente: true },
      order: { fechaCita: 'DESC' },
      skip: salto,
      take: limite,
    });

    return {
      exito: true,
      mensaje: 'Lista de citas obtenida exitosamente',
      datos: listaCitas,
      total,
      pagina,
      limite,
      totalPaginas: Math.ceil(total / limite),
    };
  }

  async obtenerCitaPorId(id: string): Promise<RespuestaApi<Cita>> {
    const cita = await this.repositorioCita.findOne({
      where: { id },
      relations: { paciente: true },
    });

    if (!cita) {
      throw new NotFoundException(`Cita con ID ${id} no encontrada`);
    }

    return {
      exito: true,
      mensaje: 'Cita obtenida exitosamente',
      datos: cita,
    };
  }

  async obtenerCitasPorPaciente(pacienteId: string): Promise<RespuestaApi<Cita[]>> {
    // Verificar que el paciente existe
    await this.pacientesService.obtenerPacientePorId(pacienteId);

    const citas = await this.repositorioCita.find({
      where: { pacienteId },
      order: { fechaCita: 'DESC' },
    });

    return {
      exito: true,
      mensaje: `Se encontraron ${citas.length} cita(s) para el paciente`,
      datos: citas,
    };
  }

  async actualizarCita(
    id: string,
    actualizarCitaDto: ActualizarCitaDto,
  ): Promise<RespuestaApi<Cita>> {
    const respuesta = await this.obtenerCitaPorId(id);
    const cita = respuesta.datos!;

    if (actualizarCitaDto.pacienteId) {
      await this.pacientesService.obtenerPacientePorId(actualizarCitaDto.pacienteId);
    }

    Object.assign(cita, actualizarCitaDto);
    const citaActualizada = await this.repositorioCita.save(cita);

    return {
      exito: true,
      mensaje: 'Cita actualizada exitosamente',
      datos: citaActualizada,
    };
  }

  async cancelarCita(id: string): Promise<RespuestaApi<Cita>> {
    const respuesta = await this.obtenerCitaPorId(id);
    const cita = respuesta.datos!;
    cita.estado = EstadoCita.CANCELADA;
    const citaCancelada = await this.repositorioCita.save(cita);

    return {
      exito: true,
      mensaje: 'Cita cancelada exitosamente',
      datos: citaCancelada,
    };
  }

  async eliminarCita(id: string): Promise<RespuestaApi<null>> {
    const respuesta = await this.obtenerCitaPorId(id);
    const cita = respuesta.datos!;
    await this.repositorioCita.remove(cita);

    return {
      exito: true,
      mensaje: 'Cita eliminada exitosamente',
    };
  }
}

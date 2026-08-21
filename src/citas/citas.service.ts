import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
  Scope,
  Logger,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import type { Request } from 'express';
import { Cita, EstadoCita } from './entities/cita.entity';
import { AuditoriaCancelacionCita } from './entities/auditoria-cancelacion-cita.entity';
import { CrearCitaDto } from './dto/crear-cita.dto';
import { ActualizarCitaDto } from './dto/actualizar-cita.dto';
import { CancelarCitaDto } from './dto/cancelar-cita.dto';
import { RespuestaApi, RespuestaPaginada } from '../common/interfaces/respuesta-api.interface';
import { PacientesService } from '../pacientes/pacientes.service';
import { Paciente } from '../pacientes/entities/paciente.entity';
import { IntegracionCitasHospitalService, DetalleCitaSap } from './services/integracion-citas-hospital.service';

const DESCRIPCIONES_MOTIVOS: Record<string, string> = {
  M02: 'Condición clínica del paciente',
  M04: 'Paciente fallece',
  M09: 'Mejoría de estado de salud del paciente',
  M11: 'Paciente no acepta / No puede asistir',
  N22: 'Paciente no preparado para la atención',
  N23: 'Paciente hospitalizado',
  N26: 'Inconvenientes de transporte o económicos',
  N38: 'No aplica / No contrato',
};

@Injectable({ scope: Scope.REQUEST })
export class CitasService {
  private readonly logger = new Logger(CitasService.name);

  constructor(
    @Inject(REQUEST) private readonly request: Request,
    private readonly pacientesService: PacientesService,
    private readonly integracionCitasService: IntegracionCitasHospitalService,
  ) {}

  private get repositorioCita() {
    return this.request.tenantConexion!.getRepository(Cita);
  }

  private get repositorioPaciente() {
    return this.request.tenantConexion!.getRepository(Paciente);
  }

  private get repositorioAuditoria() {
    return this.request.tenantConexion!.getRepository(AuditoriaCancelacionCita);
  }

  /**
   * Consulta las citas médicas reales del paciente autenticado directamente desde SAP PO
   */
  async obtenerMisCitas(usuario: any): Promise<RespuestaApi<DetalleCitaSap[]>> {
    let tipoDocumento = usuario?.tipoDocumento;
    let numeroDocumento = usuario?.numeroDocumento;

    // Si faltan datos en el token, buscar en la entidad Paciente del tenant
    if (!numeroDocumento) {
      const paciente = await this.repositorioPaciente.findOne({
        where: [
          { correoElectronico: usuario?.correoElectronico },
          { id: usuario?.pacienteId },
        ],
      });
      if (paciente) {
        tipoDocumento = paciente.tipoDocumento;
        numeroDocumento = paciente.numeroDocumento;
      }
    }

    if (!numeroDocumento) {
      return {
        exito: false,
        mensaje: 'No se encontró la identificación del paciente asociado a esta cuenta.',
        datos: [],
      };
    }

    this.logger.log(`📅 Consultando citas para paciente doc: ${numeroDocumento} (${tipoDocumento})`);

    const resultadoSap = await this.integracionCitasService.consultarAgendaPaciente({
      tipoDocumento: tipoDocumento || 'CC',
      numeroDocumento,
    });

    return {
      exito: true,
      mensaje: resultadoSap.message || 'Agenda obtenida exitosamente',
      datos: resultadoSap.citas,
    };
  }

  /**
   * Cancela una cita médica en SAP PO y registra la auditoría completa en la BD del tenant
   */
  async cancelarCitaPaciente(
    dto: CancelarCitaDto,
    usuario: any,
    ipUsuario?: string,
    userAgent?: string,
  ): Promise<RespuestaApi<AuditoriaCancelacionCita>> {
    let tipoDocumento = usuario?.tipoDocumento || 'CC';
    let numeroDocumento = usuario?.numeroDocumento;
    let nombrePaciente = `${usuario?.nombres || ''} ${usuario?.apellidos || ''}`.trim();
    let pacienteId = usuario?.pacienteId;

    if (!numeroDocumento) {
      const paciente = await this.repositorioPaciente.findOne({
        where: [
          { correoElectronico: usuario?.correoElectronico },
          { id: usuario?.pacienteId },
        ],
      });
      if (paciente) {
        tipoDocumento = paciente.tipoDocumento;
        numeroDocumento = paciente.numeroDocumento;
        nombrePaciente = `${paciente.nombres} ${paciente.apellidos}`.trim();
        pacienteId = paciente.id;
      }
    }

    this.logger.log(`🚫 Cancelando cita SAP ${dto.idCita} para paciente: ${numeroDocumento}`);

    // 1. Consumir API de cancelación en SAP PO
    const resSap = await this.integracionCitasService.cancelarCitaSAP({
      idCita: dto.idCita,
      idMotivo: dto.idMotivo,
    });

    const descMotivo = DESCRIPCIONES_MOTIVOS[dto.idMotivo] || `Motivo ${dto.idMotivo}`;

    // 2. Guardar registro de auditoría en la BD del Tenant
    const auditoria = this.repositorioAuditoria.create({
      idCita: dto.idCita,
      pacienteId,
      usuarioId: usuario?.id,
      numeroDocumento: numeroDocumento || 'Desconocido',
      tipoDocumento: tipoDocumento || 'CC',
      nombrePaciente: nombrePaciente || 'Paciente',
      idMotivo: dto.idMotivo,
      descripcionMotivo: descMotivo,
      observaciones: dto.observaciones || undefined,
      limiteHoras: 24,
      codigoRespuestaSap: resSap.idMessage,
      mensajeRespuestaSap: resSap.message,
      exitosa: resSap.exitosa,
      ipUsuario,
      userAgent,
      datosCita: dto.datosCita || undefined,
    });

    const auditoriaGuardada = await this.repositorioAuditoria.save(auditoria);
    this.logger.log(`📝 Auditoría de cancelación guardada en BD con ID: ${auditoriaGuardada.id}`);

    if (!resSap.exitosa) {
      throw new BadRequestException(resSap.message || 'No fue posible cancelar la cita médica.');
    }

    return {
      exito: true,
      mensaje: resSap.message || 'Cancelación de cita procesada exitosamente.',
      datos: auditoriaGuardada,
    };
  }

  async crearCita(crearCitaDto: CrearCitaDto): Promise<RespuestaApi<Cita>> {
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
    usuario?: any,
  ): Promise<any> {
    if (usuario?.rol === 'paciente') {
      return this.obtenerMisCitas(usuario);
    }

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

  async obtenerCitasPorPaciente(pacienteId: string): Promise<RespuestaApi<any>> {
    const paciente = await this.repositorioPaciente.findOne({
      where: { id: pacienteId },
    });

    if (paciente) {
      const resultadoSap = await this.integracionCitasService.consultarAgendaPaciente({
        tipoDocumento: paciente.tipoDocumento || 'CC',
        numeroDocumento: paciente.numeroDocumento,
      });

      if (resultadoSap.citas && resultadoSap.citas.length > 0) {
        return {
          exito: true,
          mensaje: resultadoSap.message,
          datos: resultadoSap.citas,
        };
      }
    }

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

import {
  Injectable,
  NotFoundException,
  ConflictException,
  Inject,
  Scope,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import type { Request } from 'express';
import { Paciente } from './entities/paciente.entity';
import { CrearPacienteDto } from './dto/crear-paciente.dto';
import { ActualizarPacienteDto } from './dto/actualizar-paciente.dto';
import { RespuestaApi, RespuestaPaginada } from '../common/interfaces/respuesta-api.interface';

@Injectable({ scope: Scope.REQUEST })
export class PacientesService {
  constructor(
    @Inject(REQUEST) private readonly request: Request,
  ) {}

  private get repositorioPaciente() {
    return this.request.tenantConexion!.getRepository(Paciente);
  }

  async crearPaciente(crearPacienteDto: CrearPacienteDto): Promise<RespuestaApi<Paciente>> {
    const pacienteExistente = await this.repositorioPaciente.findOne({
      where: { numeroDocumento: crearPacienteDto.numeroDocumento },
    });

    if (pacienteExistente) {
      throw new ConflictException(
        `Ya existe un paciente con el documento ${crearPacienteDto.numeroDocumento}`,
      );
    }

    const nuevoPaciente = this.repositorioPaciente.create(crearPacienteDto);
    const pacienteGuardado = await this.repositorioPaciente.save(nuevoPaciente);

    return {
      exito: true,
      mensaje: 'Paciente creado exitosamente',
      datos: pacienteGuardado,
    };
  }

  async obtenerTodosPacientes(
    pagina = 1,
    limite = 10,
  ): Promise<RespuestaPaginada<Paciente>> {
    const salto = (pagina - 1) * limite;

    const [listaPacientes, total] = await this.repositorioPaciente.findAndCount({
      order: { creadoEn: 'DESC' },
      skip: salto,
      take: limite,
    });

    return {
      exito: true,
      mensaje: 'Lista de pacientes obtenida exitosamente',
      datos: listaPacientes,
      total,
      pagina,
      limite,
      totalPaginas: Math.ceil(total / limite),
    };
  }

  async obtenerPacientePorId(id: string): Promise<RespuestaApi<Paciente>> {
    const paciente = await this.repositorioPaciente.findOne({
      where: { id },
      relations: { citas: true },
    });

    if (!paciente) {
      throw new NotFoundException(`Paciente con ID ${id} no encontrado`);
    }

    return {
      exito: true,
      mensaje: 'Paciente obtenido exitosamente',
      datos: paciente,
    };
  }

  async actualizarPaciente(
    id: string,
    actualizarPacienteDto: ActualizarPacienteDto,
  ): Promise<RespuestaApi<Paciente>> {
    const respuesta = await this.obtenerPacientePorId(id);
    const paciente = respuesta.datos!;

    if (
      actualizarPacienteDto.numeroDocumento &&
      actualizarPacienteDto.numeroDocumento !== paciente.numeroDocumento
    ) {
      const documentoDuplicado = await this.repositorioPaciente.findOne({
        where: { numeroDocumento: actualizarPacienteDto.numeroDocumento },
      });

      if (documentoDuplicado) {
        throw new ConflictException(
          `Ya existe un paciente con el documento ${actualizarPacienteDto.numeroDocumento}`,
        );
      }
    }

    Object.assign(paciente, actualizarPacienteDto);
    const pacienteActualizado = await this.repositorioPaciente.save(paciente);

    return {
      exito: true,
      mensaje: 'Paciente actualizado exitosamente',
      datos: pacienteActualizado,
    };
  }

  async eliminarPaciente(id: string): Promise<RespuestaApi<null>> {
    const respuesta = await this.obtenerPacientePorId(id);
    const paciente = respuesta.datos!;
    await this.repositorioPaciente.remove(paciente);

    return {
      exito: true,
      mensaje: 'Paciente eliminado exitosamente',
    };
  }

  async buscarPacientes(termino: string): Promise<RespuestaApi<Paciente[]>> {
    const resultados = await this.repositorioPaciente
      .createQueryBuilder('paciente')
      .where('paciente.nombres ILIKE :termino', { termino: `%${termino}%` })
      .orWhere('paciente.apellidos ILIKE :termino', { termino: `%${termino}%` })
      .orWhere('paciente.numeroDocumento ILIKE :termino', { termino: `%${termino}%` })
      .orWhere('paciente.correoElectronico ILIKE :termino', { termino: `%${termino}%` })
      .orderBy('paciente.apellidos', 'ASC')
      .getMany();

    return {
      exito: true,
      mensaje: `Se encontraron ${resultados.length} resultado(s)`,
      datos: resultados,
    };
  }
}

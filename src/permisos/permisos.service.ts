import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  Scope,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import type { Request } from 'express';
import { In, Not } from 'typeorm';
import { Permiso } from './entities/permiso.entity';
import { CrearPermisoDto } from './dto/crear-permiso.dto';
import { ActualizarPermisoDto } from './dto/actualizar-permiso.dto';
import { CATALOGO_PERMISOS } from './constantes/catalogo-permisos';
import { RespuestaApi } from '../common/interfaces/respuesta-api.interface';

@Injectable({ scope: Scope.REQUEST })
export class PermisosService {
  constructor(@Inject(REQUEST) private readonly request: Request) {}

  private get repositorioPermiso() {
    return this.request.tenantConexion!.getRepository(Permiso);
  }

  async obtenerTodos(): Promise<RespuestaApi<Permiso[]>> {
    const permisos = await this.repositorioPermiso.find({
      where: { modulo: Not('tenants') },
      order: { modulo: 'ASC', nombre: 'ASC' },
    });

    return {
      exito: true,
      mensaje: 'Permisos obtenidos exitosamente',
      datos: permisos,
    };
  }

  async obtenerPorModulo(): Promise<RespuestaApi<Record<string, Permiso[]>>> {
    const permisos = await this.repositorioPermiso.find({
      where: { activo: true, modulo: Not('tenants') },
      order: { modulo: 'ASC', nombre: 'ASC' },
    });

    const agrupados: Record<string, Permiso[]> = {};
    for (const p of permisos) {
      if (p.modulo === 'tenants') continue;
      if (!agrupados[p.modulo]) {
        agrupados[p.modulo] = [];
      }
      agrupados[p.modulo].push(p);
    }

    return {
      exito: true,
      mensaje: 'Permisos agrupados por módulo obtenidos exitosamente',
      datos: agrupados,
    };
  }

  async obtenerPorId(id: string): Promise<RespuestaApi<Permiso>> {
    const permiso = await this.repositorioPermiso.findOne({ where: { id } });
    if (!permiso) {
      throw new NotFoundException(`Permiso con ID "${id}" no encontrado`);
    }

    return {
      exito: true,
      mensaje: 'Permiso obtenido exitosamente',
      datos: permiso,
    };
  }

  async crear(crearPermisoDto: CrearPermisoDto): Promise<RespuestaApi<Permiso>> {
    const codigoLimpio = crearPermisoDto.codigo.trim().toLowerCase();
    const moduloLimpio = crearPermisoDto.modulo.trim().toLowerCase();

    if (moduloLimpio === 'tenants' || codigoLimpio.startsWith('tenants.')) {
      throw new BadRequestException('El módulo tenants es de gestión exclusiva de super-administrador y no admite permisos asignables');
    }
    const existe = await this.repositorioPermiso.findOne({
      where: { codigo: codigoLimpio },
    });

    if (existe) {
      throw new ConflictException(`Ya existe un permiso con el código "${codigoLimpio}"`);
    }

    const nuevoPermiso = this.repositorioPermiso.create({
      ...crearPermisoDto,
      codigo: codigoLimpio,
    });

    const guardado = await this.repositorioPermiso.save(nuevoPermiso);

    return {
      exito: true,
      mensaje: 'Permiso creado exitosamente',
      datos: guardado,
    };
  }

  async actualizar(id: string, actualizarPermisoDto: ActualizarPermisoDto): Promise<RespuestaApi<Permiso>> {
    const permiso = await this.repositorioPermiso.findOne({ where: { id } });
    if (!permiso) {
      throw new NotFoundException(`Permiso con ID "${id}" no encontrado`);
    }

    if (actualizarPermisoDto.codigo) {
      const codigoLimpio = actualizarPermisoDto.codigo.trim().toLowerCase();
      if (codigoLimpio !== permiso.codigo) {
        const existeOtro = await this.repositorioPermiso.findOne({
          where: { codigo: codigoLimpio },
        });
        if (existeOtro) {
          throw new ConflictException(`Ya existe otro permiso con el código "${codigoLimpio}"`);
        }
        permiso.codigo = codigoLimpio;
      }
    }

    if (actualizarPermisoDto.nombre !== undefined) permiso.nombre = actualizarPermisoDto.nombre;
    if (actualizarPermisoDto.descripcion !== undefined) permiso.descripcion = actualizarPermisoDto.descripcion;
    if (actualizarPermisoDto.modulo !== undefined) permiso.modulo = actualizarPermisoDto.modulo;
    if (actualizarPermisoDto.activo !== undefined) permiso.activo = actualizarPermisoDto.activo;

    const actualizado = await this.repositorioPermiso.save(permiso);

    return {
      exito: true,
      mensaje: 'Permiso actualizado exitosamente',
      datos: actualizado,
    };
  }

  async eliminar(id: string): Promise<RespuestaApi<null>> {
    const permiso = await this.repositorioPermiso.findOne({
      where: { id },
      relations: { roles: true, usuarios: true },
    });

    if (!permiso) {
      throw new NotFoundException(`Permiso con ID "${id}" no encontrado`);
    }

    if (permiso.roles?.length > 0 || permiso.usuarios?.length > 0) {
      throw new BadRequestException(
        'No se puede eliminar el permiso porque está asignado a uno o más roles o usuarios. Desasígnalo primero o desactívalo.',
      );
    }

    await this.repositorioPermiso.remove(permiso);

    return {
      exito: true,
      mensaje: 'Permiso eliminado exitosamente',
      datos: null,
    };
  }

  async sincronizarCatalogo(): Promise<RespuestaApi<{ creados: number; existentes: number }>> {
    let creados = 0;
    let existentes = 0;

    for (const item of CATALOGO_PERMISOS) {
      const permisoExistente = await this.repositorioPermiso.findOne({
        where: { codigo: item.codigo },
      });

      if (!permisoExistente) {
        const nuevo = this.repositorioPermiso.create({
          codigo: item.codigo,
          nombre: item.nombre,
          descripcion: item.descripcion,
          modulo: item.modulo,
          activo: true,
        });
        await this.repositorioPermiso.save(nuevo);
        creados++;
      } else {
        existentes++;
      }
    }

    return {
      exito: true,
      mensaje: `Sincronización completada: ${creados} permisos creados, ${existentes} ya existentes`,
      datos: { creados, existentes },
    };
  }
}

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
import { In } from 'typeorm';
import { Rol } from './entities/rol.entity';
import { Permiso } from '../permisos/entities/permiso.entity';
import { CrearRolDto } from './dto/crear-rol.dto';
import { ActualizarRolDto } from './dto/actualizar-rol.dto';
import { RespuestaApi } from '../common/interfaces/respuesta-api.interface';

@Injectable({ scope: Scope.REQUEST })
export class RolesService {
  constructor(@Inject(REQUEST) private readonly request: Request) {}

  private get repositorioRol() {
    return this.request.tenantConexion!.getRepository(Rol);
  }

  private get repositorioPermiso() {
    return this.request.tenantConexion!.getRepository(Permiso);
  }

  async obtenerTodos(): Promise<RespuestaApi<any[]>> {
    const roles = await this.repositorioRol.find({
      relations: { permisos: true, usuarios: true },
      order: { nombre: 'ASC' },
    });

    const rolesConConteo = roles.map((rol) => ({
      id: rol.id,
      codigo: rol.codigo,
      nombre: rol.nombre,
      descripcion: rol.descripcion,
      esSistema: rol.esSistema,
      activo: rol.activo,
      totalUsuarios: rol.usuarios?.length || 0,
      totalPermisos: rol.permisos?.length || 0,
      permisos: rol.permisos || [],
      creadoEn: rol.creadoEn,
      actualizadoEn: rol.actualizadoEn,
    }));

    return {
      exito: true,
      mensaje: 'Roles obtenidos exitosamente',
      datos: rolesConConteo,
    };
  }

  async obtenerPorId(id: string): Promise<RespuestaApi<Rol>> {
    const rol = await this.repositorioRol.findOne({
      where: { id },
      relations: { permisos: true },
    });

    if (!rol) {
      throw new NotFoundException(`Rol con ID "${id}" no encontrado`);
    }

    return {
      exito: true,
      mensaje: 'Rol obtenido exitosamente',
      datos: rol,
    };
  }

  async crear(crearRolDto: CrearRolDto): Promise<RespuestaApi<Rol>> {
    const codigoLimpio = crearRolDto.codigo.trim().toLowerCase().replace(/\s+/g, '_');

    const existe = await this.repositorioRol.findOne({
      where: { codigo: codigoLimpio },
    });

    if (existe) {
      throw new ConflictException(`Ya existe un rol con el código "${codigoLimpio}"`);
    }

    let permisos: Permiso[] = [];
    if (crearRolDto.permisoIds && crearRolDto.permisoIds.length > 0) {
      permisos = await this.repositorioPermiso.findBy({
        id: In(crearRolDto.permisoIds),
      });
    }

    const nuevoRol = this.repositorioRol.create({
      codigo: codigoLimpio,
      nombre: crearRolDto.nombre.trim(),
      descripcion: crearRolDto.descripcion?.trim(),
      activo: crearRolDto.activo !== undefined ? crearRolDto.activo : true,
      esSistema: false,
      permisos,
    });

    const guardado = await this.repositorioRol.save(nuevoRol);

    return {
      exito: true,
      mensaje: 'Rol creado exitosamente',
      datos: guardado,
    };
  }

  async actualizar(id: string, actualizarRolDto: ActualizarRolDto): Promise<RespuestaApi<Rol>> {
    const rol = await this.repositorioRol.findOne({
      where: { id },
      relations: { permisos: true },
    });

    if (!rol) {
      throw new NotFoundException(`Rol con ID "${id}" no encontrado`);
    }

    if (actualizarRolDto.codigo) {
      const codigoLimpio = actualizarRolDto.codigo.trim().toLowerCase().replace(/\s+/g, '_');
      if (codigoLimpio !== rol.codigo) {
        if (rol.esSistema) {
          throw new BadRequestException('No se puede modificar el código de un rol del sistema');
        }
        const existeOtro = await this.repositorioRol.findOne({
          where: { codigo: codigoLimpio },
        });
        if (existeOtro) {
          throw new ConflictException(`Ya existe otro rol con el código "${codigoLimpio}"`);
        }
        rol.codigo = codigoLimpio;
      }
    }

    if (actualizarRolDto.nombre !== undefined) rol.nombre = actualizarRolDto.nombre.trim();
    if (actualizarRolDto.descripcion !== undefined) rol.descripcion = actualizarRolDto.descripcion?.trim();
    if (actualizarRolDto.activo !== undefined) {
      if (rol.esSistema && actualizarRolDto.activo === false) {
        throw new BadRequestException('No se puede desactivar un rol del sistema');
      }
      rol.activo = actualizarRolDto.activo;
    }

    if (actualizarRolDto.permisoIds !== undefined) {
      if (actualizarRolDto.permisoIds.length > 0) {
        rol.permisos = await this.repositorioPermiso.findBy({
          id: In(actualizarRolDto.permisoIds),
        });
      } else {
        rol.permisos = [];
      }
    }

    const actualizado = await this.repositorioRol.save(rol);

    return {
      exito: true,
      mensaje: 'Rol actualizado exitosamente',
      datos: actualizado,
    };
  }

  async eliminar(id: string): Promise<RespuestaApi<null>> {
    const rol = await this.repositorioRol.findOne({
      where: { id },
      relations: { usuarios: true },
    });

    if (!rol) {
      throw new NotFoundException(`Rol con ID "${id}" no encontrado`);
    }

    if (rol.esSistema) {
      throw new BadRequestException('No se puede eliminar un rol protegido del sistema');
    }

    if (rol.usuarios && rol.usuarios.length > 0) {
      throw new BadRequestException(
        `No se puede eliminar el rol porque tiene ${rol.usuarios.length} usuario(s) asignado(s). Reasigna los usuarios primero.`,
      );
    }

    await this.repositorioRol.remove(rol);

    return {
      exito: true,
      mensaje: 'Rol eliminado exitosamente',
      datos: null,
    };
  }
}

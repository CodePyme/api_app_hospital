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
import * as bcrypt from 'bcrypt';
import { Usuario, RolUsuario } from '../autenticacion/entities/usuario.entity';
import { Rol } from '../roles/entities/rol.entity';
import { Permiso } from '../permisos/entities/permiso.entity';
import { CrearUsuarioDto } from './dto/crear-usuario.dto';
import { ActualizarUsuarioDto } from './dto/actualizar-usuario.dto';
import { CambiarContrasenaDto } from './dto/cambiar-contrasena.dto';
import { RespuestaApi } from '../common/interfaces/respuesta-api.interface';
import { calcularPermisosConsolidados } from '../permisos/permisos.utils';

@Injectable({ scope: Scope.REQUEST })
export class UsuariosService {
  private readonly RONDAS_HASH = 10;
  private readonly CORREO_SUPER_ADMIN = 'admin@codepyme.com';

  constructor(@Inject(REQUEST) private readonly request: Request) {}

  private get repositorioUsuario() {
    return this.request.tenantConexion!.getRepository(Usuario);
  }

  private get repositorioRol() {
    return this.request.tenantConexion!.getRepository(Rol);
  }

  private get repositorioPermiso() {
    return this.request.tenantConexion!.getRepository(Permiso);
  }

  /**
   * Obtiene la lista de usuarios de plataforma (excluyendo pacientes de portal por defecto)
   */
  async obtenerUsuarios(incluirPacientes = false): Promise<RespuestaApi<any[]>> {
    const whereCondition: any = {};
    if (!incluirPacientes) {
      whereCondition.rol = Not(RolUsuario.PACIENTE);
    }

    const usuarios = await this.repositorioUsuario.find({
      where: whereCondition,
      relations: { rolEntidad: { permisos: true }, permisosDirectos: true },
      order: { creadoEn: 'DESC' },
    });

    const usuariosMapeados = usuarios.map((u) => {
      const { contrasena: _, ...resto } = u;
      return {
        ...resto,
        permisosConsolidados: calcularPermisosConsolidados(u),
      };
    });

    return {
      exito: true,
      mensaje: 'Usuarios obtenidos exitosamente',
      datos: usuariosMapeados,
    };
  }

  async obtenerPorId(id: string): Promise<RespuestaApi<any>> {
    const usuario = await this.repositorioUsuario.findOne({
      where: { id },
      relations: { rolEntidad: { permisos: true }, permisosDirectos: true },
    });

    if (!usuario) {
      throw new NotFoundException(`Usuario con ID "${id}" no encontrado`);
    }

    const { contrasena: _, ...resto } = usuario;

    return {
      exito: true,
      mensaje: 'Usuario obtenido exitosamente',
      datos: {
        ...resto,
        permisosConsolidados: calcularPermisosConsolidados(usuario),
      },
    };
  }

  async crear(crearUsuarioDto: CrearUsuarioDto): Promise<RespuestaApi<any>> {
    const correoLimpio = crearUsuarioDto.correoElectronico.trim().toLowerCase();

    const existe = await this.repositorioUsuario.findOne({
      where: { correoElectronico: correoLimpio },
    });

    if (existe) {
      throw new ConflictException(`Ya existe un usuario con el correo "${correoLimpio}"`);
    }

    // Buscar rol asignado
    const rol = await this.repositorioRol.findOne({
      where: { id: crearUsuarioDto.rolId },
    });

    if (!rol) {
      throw new NotFoundException('El rol especificado no existe');
    }

    // Buscar permisos directos si los hay
    let permisosDirectos: Permiso[] = [];
    if (crearUsuarioDto.permisoIds && crearUsuarioDto.permisoIds.length > 0) {
      permisosDirectos = await this.repositorioPermiso.findBy({
        id: In(crearUsuarioDto.permisoIds),
      });
    }

    const contrasenaHasheada = await bcrypt.hash(crearUsuarioDto.contrasena, this.RONDAS_HASH);

    // Mapear el código del rol al enum si coincide, o guardar el rol
    let rolEnum = RolUsuario.ADMINISTRADOR;
    if (rol.codigo === 'medico') rolEnum = RolUsuario.MEDICO;
    else if (rol.codigo === 'recepcionista') rolEnum = RolUsuario.RECEPCIONISTA;
    else if (rol.codigo === 'paciente') rolEnum = RolUsuario.PACIENTE;

    const nuevoUsuario = this.repositorioUsuario.create({
      nombres: crearUsuarioDto.nombres.trim(),
      apellidos: crearUsuarioDto.apellidos.trim(),
      correoElectronico: correoLimpio,
      contrasena: contrasenaHasheada,
      rol: rolEnum,
      rolId: rol.id,
      rolEntidad: rol,
      permisosDirectos,
      activo: crearUsuarioDto.activo !== undefined ? crearUsuarioDto.activo : true,
    });

    const guardado = await this.repositorioUsuario.save(nuevoUsuario);
    const { contrasena: _, ...resto } = guardado;

    return {
      exito: true,
      mensaje: 'Usuario administrativo creado exitosamente',
      datos: {
        ...resto,
        permisosConsolidados: calcularPermisosConsolidados(guardado),
      },
    };
  }

  async actualizar(id: string, actualizarUsuarioDto: ActualizarUsuarioDto): Promise<RespuestaApi<any>> {
    const usuario = await this.repositorioUsuario.findOne({
      where: { id },
      relations: { rolEntidad: true, permisosDirectos: true },
    });

    if (!usuario) {
      throw new NotFoundException(`Usuario con ID "${id}" no encontrado`);
    }

    if (actualizarUsuarioDto.correoElectronico) {
      const correoLimpio = actualizarUsuarioDto.correoElectronico.trim().toLowerCase();
      if (correoLimpio !== usuario.correoElectronico) {
        if (usuario.correoElectronico === this.CORREO_SUPER_ADMIN) {
          throw new BadRequestException('No se puede modificar el correo del super administrador');
        }

        const existeOtro = await this.repositorioUsuario.findOne({
          where: { correoElectronico: correoLimpio },
        });

        if (existeOtro) {
          throw new ConflictException(`Ya existe otro usuario con el correo "${correoLimpio}"`);
        }
        usuario.correoElectronico = correoLimpio;
      }
    }

    if (actualizarUsuarioDto.nombres !== undefined) usuario.nombres = actualizarUsuarioDto.nombres.trim();
    if (actualizarUsuarioDto.apellidos !== undefined) usuario.apellidos = actualizarUsuarioDto.apellidos.trim();

    if (actualizarUsuarioDto.contrasena && actualizarUsuarioDto.contrasena.trim().length >= 6) {
      usuario.contrasena = await bcrypt.hash(actualizarUsuarioDto.contrasena.trim(), this.RONDAS_HASH);
    }

    if (actualizarUsuarioDto.activo !== undefined) {
      if (usuario.correoElectronico === this.CORREO_SUPER_ADMIN && !actualizarUsuarioDto.activo) {
        throw new BadRequestException('No se puede desactivar al super administrador');
      }
      usuario.activo = actualizarUsuarioDto.activo;
    }

    if (actualizarUsuarioDto.rolId !== undefined) {
      const rol = await this.repositorioRol.findOne({
        where: { id: actualizarUsuarioDto.rolId },
      });

      if (!rol) {
        throw new NotFoundException('El rol especificado no existe');
      }

      usuario.rolId = rol.id;
      usuario.rolEntidad = rol;
      if (rol.codigo === 'medico') usuario.rol = RolUsuario.MEDICO;
      else if (rol.codigo === 'recepcionista') usuario.rol = RolUsuario.RECEPCIONISTA;
      else if (rol.codigo === 'paciente') usuario.rol = RolUsuario.PACIENTE;
      else usuario.rol = RolUsuario.ADMINISTRADOR;
    }

    if (actualizarUsuarioDto.permisoIds !== undefined) {
      if (actualizarUsuarioDto.permisoIds.length > 0) {
        usuario.permisosDirectos = await this.repositorioPermiso.findBy({
          id: In(actualizarUsuarioDto.permisoIds),
        });
      } else {
        usuario.permisosDirectos = [];
      }
    }

    const guardado = await this.repositorioUsuario.save(usuario);
    const { contrasena: _, ...resto } = guardado;

    return {
      exito: true,
      mensaje: 'Usuario actualizado exitosamente',
      datos: {
        ...resto,
        permisosConsolidados: calcularPermisosConsolidados(guardado),
      },
    };
  }

  async cambiarContrasena(id: string, dto: CambiarContrasenaDto): Promise<RespuestaApi<null>> {
    const usuario = await this.repositorioUsuario.findOne({ where: { id } });
    if (!usuario) {
      throw new NotFoundException(`Usuario con ID "${id}" no encontrado`);
    }

    usuario.contrasena = await bcrypt.hash(dto.nuevaContrasena.trim(), this.RONDAS_HASH);
    await this.repositorioUsuario.save(usuario);

    return {
      exito: true,
      mensaje: 'Contraseña actualizada exitosamente',
      datos: null,
    };
  }

  async eliminar(id: string): Promise<RespuestaApi<null>> {
    const usuario = await this.repositorioUsuario.findOne({ where: { id } });
    if (!usuario) {
      throw new NotFoundException(`Usuario con ID "${id}" no encontrado`);
    }

    if (usuario.correoElectronico === this.CORREO_SUPER_ADMIN) {
      throw new BadRequestException('No se puede eliminar al super administrador de la plataforma');
    }

    await this.repositorioUsuario.remove(usuario);

    return {
      exito: true,
      mensaje: 'Usuario eliminado exitosamente',
      datos: null,
    };
  }
}

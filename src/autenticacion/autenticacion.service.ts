import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  Inject,
  Scope,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import type { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Usuario } from './entities/usuario.entity';
import { IniciarSesionDto } from './dto/iniciar-sesion.dto';
import { RegistrarUsuarioDto } from './dto/registrar-usuario.dto';
import { RespuestaApi } from '../common/interfaces/respuesta-api.interface';

@Injectable({ scope: Scope.REQUEST })
export class AutenticacionService {
  private readonly RONDAS_HASH = 10;

  constructor(
    @Inject(REQUEST) private readonly request: Request,
    private readonly servicioJwt: JwtService,
  ) {}

  private get repositorioUsuario() {
    return this.request.tenantConexion!.getRepository(Usuario);
  }

  async registrarUsuario(
    registrarUsuarioDto: RegistrarUsuarioDto,
  ): Promise<RespuestaApi<Omit<Usuario, 'contrasena'>>> {
    const usuarioExistente = await this.repositorioUsuario.findOne({
      where: { correoElectronico: registrarUsuarioDto.correoElectronico },
    });

    if (usuarioExistente) {
      throw new ConflictException(
        `Ya existe un usuario con el correo ${registrarUsuarioDto.correoElectronico}`,
      );
    }

    const contrasenaHasheada = await bcrypt.hash(
      registrarUsuarioDto.contrasena,
      this.RONDAS_HASH,
    );

    const nuevoUsuario = this.repositorioUsuario.create({
      ...registrarUsuarioDto,
      contrasena: contrasenaHasheada,
    });

    const usuarioGuardado = await this.repositorioUsuario.save(nuevoUsuario);
    const { contrasena: _contrasena, ...usuarioSinContrasena } = usuarioGuardado;

    return {
      exito: true,
      mensaje: 'Usuario registrado exitosamente',
      datos: usuarioSinContrasena as Omit<Usuario, 'contrasena'>,
    };
  }

  async iniciarSesion(
    iniciarSesionDto: IniciarSesionDto,
  ): Promise<RespuestaApi<{ token: string; usuario: Omit<Usuario, 'contrasena'> }>> {
    const usuario = await this.repositorioUsuario.findOne({
      where: { correoElectronico: iniciarSesionDto.correoElectronico, activo: true },
    });

    if (!usuario) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    const contrasenaValida = await bcrypt.compare(
      iniciarSesionDto.contrasena,
      usuario.contrasena,
    );

    if (!contrasenaValida) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    const cargaJwt = {
      sub: usuario.id,
      correoElectronico: usuario.correoElectronico,
      rol: usuario.rol,
    };

    const token = await this.servicioJwt.signAsync(cargaJwt);
    const { contrasena: _contrasena, ...usuarioSinContrasena } = usuario;

    return {
      exito: true,
      mensaje: 'Sesión iniciada exitosamente',
      datos: {
        token,
        usuario: usuarioSinContrasena as Omit<Usuario, 'contrasena'>,
      },
    };
  }

  async obtenerPerfilUsuario(usuario: Usuario): Promise<RespuestaApi<Omit<Usuario, 'contrasena'>>> {
    const { contrasena: _contrasena, ...perfilUsuario } = usuario;

    return {
      exito: true,
      mensaje: 'Perfil del usuario obtenido exitosamente',
      datos: perfilUsuario as Omit<Usuario, 'contrasena'>,
    };
  }
}

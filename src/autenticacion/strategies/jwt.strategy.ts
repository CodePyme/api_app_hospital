import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { Usuario } from '../entities/usuario.entity';

interface CargaJwt {
  sub: string;
  correoElectronico: string;
  rol: string;
  nombres?: string;
  apellidos?: string;
  pacienteId?: string;
  tipoDocumento?: string;
  numeroDocumento?: string;
}

@Injectable()
export class EstrategiaJwt extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    const secreto = configService.get<string>('JWT_SECRETO');
    if (!secreto) {
      throw new Error(
        'JWT_SECRETO no está configurado. Defina esta variable de entorno antes de iniciar la aplicación.',
      );
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secreto,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, cargaJwt: CargaJwt): Promise<any> {
    if (!req.tenantConexion) {
      throw new UnauthorizedException('Tenant no configurado para la petición');
    }

    const repositorioUsuario = req.tenantConexion.getRepository(Usuario);
    const usuario = await repositorioUsuario.findOne({
      where: { id: cargaJwt.sub, activo: true },
    });

    if (!usuario) {
      throw new UnauthorizedException('Token inválido o usuario no encontrado');
    }

    return {
      ...usuario,
      pacienteId: cargaJwt.pacienteId,
      tipoDocumento: cargaJwt.tipoDocumento,
      numeroDocumento: cargaJwt.numeroDocumento,
    };
  }
}

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { Usuario } from '../entities/usuario.entity';

interface CargaJwt {
  sub: string;
  correoElectronico: string;
  rol: string;
}

@Injectable()
export class EstrategiaJwt extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRETO || 'secreto_por_defecto',
      passReqToCallback: true,
    });
  }

  async validate(req: Request, cargaJwt: CargaJwt): Promise<Usuario> {
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

    return usuario;
  }
}

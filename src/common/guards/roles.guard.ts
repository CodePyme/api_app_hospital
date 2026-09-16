import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { RolUsuario } from '../../autenticacion/entities/usuario.entity';

/**
 * Restringe el acceso según el rol del usuario autenticado (req.user.rol).
 * Debe usarse siempre después de GuardJwtAutenticacion.
 * Si una ruta no declara @Roles(...), se permite el acceso a cualquier usuario autenticado
 * (útil para endpoints de autoconsulta como "mi perfil" o "mis citas").
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const rolesPermitidos = this.reflector.getAllAndOverride<RolUsuario[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!rolesPermitidos || rolesPermitidos.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user || !rolesPermitidos.includes(user.rol)) {
      throw new ForbiddenException('No tienes permisos para acceder a este recurso.');
    }

    return true;
  }
}

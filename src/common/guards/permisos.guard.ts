import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISOS_KEY } from '../decorators/permisos.decorator';
import { RolUsuario } from '../../autenticacion/entities/usuario.entity';

@Injectable()
export class PermisosGuard implements CanActivate {
  private readonly CORREO_SUPER_ADMIN = 'admin@codepyme.com';

  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const permisosRequeridos = this.reflector.getAllAndOverride<string[]>(PERMISOS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!permisosRequeridos || permisosRequeridos.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user) {
      throw new ForbiddenException('No tienes permisos para acceder a este recurso.');
    }

    // Super admin tiene acceso total a todos los módulos
    if (user.correoElectronico === this.CORREO_SUPER_ADMIN) {
      return true;
    }

    // Permisos asignados al usuario (directos + rol)
    const permisosUsuario: string[] = Array.isArray(user.permisos) ? user.permisos : [];

    // Si tiene el comodín '*' tiene todos los permisos
    if (permisosUsuario.includes('*')) {
      return true;
    }

    // Comprobar si el usuario tiene al menos uno de los permisos requeridos
    const tienePermiso = permisosRequeridos.some((p) => permisosUsuario.includes(p));

    if (!tienePermiso) {
      // Como fallback para administradores clásicos si aún no han migrado sus permisos en BD
      if (user.rol === RolUsuario.ADMINISTRADOR) {
        return true;
      }

      throw new ForbiddenException(
        `Permiso denegado. Se requiere alguno de los siguientes permisos: ${permisosRequeridos.join(', ')}`,
      );
    }

    return true;
  }
}

import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';

/**
 * Guard que restringe el acceso exclusivamente al super-administrador del sistema.
 * Solo la cuenta admin@codepyme.com puede acceder a las rutas protegidas por este guard.
 */
@Injectable()
export class SuperAdminGuard implements CanActivate {
  private readonly CORREO_SUPER_ADMIN = 'admin@codepyme.com';

  canActivate(context: ExecutionContext): boolean {
    const solicitud = context.switchToHttp().getRequest();
    const usuario = solicitud.user;

    if (!usuario) {
      throw new ForbiddenException('Acceso denegado: se requiere autenticación');
    }

    if (usuario.correoElectronico !== this.CORREO_SUPER_ADMIN) {
      throw new ForbiddenException(
        'Acceso denegado: solo el super administrador puede gestionar los tenants',
      );
    }

    return true;
  }
}

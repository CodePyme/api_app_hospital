import { SetMetadata } from '@nestjs/common';
import { RolUsuario } from '../../autenticacion/entities/usuario.entity';

export const ROLES_KEY = 'roles';

/**
 * Restringe el acceso a una ruta a los roles indicados.
 * Se combina con RolesGuard, que lee este metadato.
 */
export const Roles = (...roles: RolUsuario[]) => SetMetadata(ROLES_KEY, roles);

import { SetMetadata } from '@nestjs/common';

export const PERMISOS_KEY = 'permisos';

/**
 * Restringe el acceso a una ruta a los códigos de permisos indicados.
 * Se combina con PermisosGuard, que lee este metadato.
 * Si se pasan varios permisos, por defecto con que el usuario tenga al menos uno se permite (o todos según lógica).
 */
export const RequierePermisos = (...permisos: string[]) => SetMetadata(PERMISOS_KEY, permisos);

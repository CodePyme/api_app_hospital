import { Usuario, RolUsuario } from '../autenticacion/entities/usuario.entity';

/**
 * Permisos por defecto para roles de sistema cuando la base de datos
 * aún no ha sido poblada o no tiene relaciones creadas.
 */
const PERMISOS_DEFAULT_PACIENTE = [
  'dashboard.ver',
  'citas.ver',
  'citas.crear',
  'citas.cancelar',
  'resultados.ver',
  'resultados.descargar',
  'historia.ver',
  'historia.descargar',
  'medicamentos.ver',
];

const PERMISOS_DEFAULT_MEDICO = [
  'dashboard.ver',
  'pacientes.ver',
  'citas.ver',
  'resultados.ver',
  'resultados.descargar',
  'historia.ver',
  'historia.descargar',
  'medicamentos.ver',
];

const PERMISOS_DEFAULT_RECEPCIONISTA = [
  'dashboard.ver',
  'pacientes.ver',
  'pacientes.crear',
  'pacientes.editar',
  'citas.ver',
  'citas.crear',
  'citas.cancelar',
];

export function calcularPermisosConsolidados(usuario: Usuario): string[] {
  const permisos = new Set<string>();

  // Si es super admin por correo, tiene todos los permisos
  if (usuario.correoElectronico === 'admin@codepyme.com') {
    permisos.add('*');
    return Array.from(permisos);
  }

  // Permisos del Rol asignado
  if (usuario.rolEntidad && usuario.rolEntidad.activo && Array.isArray(usuario.rolEntidad.permisos)) {
    for (const permiso of usuario.rolEntidad.permisos) {
      if (permiso && permiso.activo && permiso.codigo) {
        permisos.add(permiso.codigo);
      }
    }
  }

  // Permisos directos asignados al usuario
  if (Array.isArray(usuario.permisosDirectos)) {
    for (const permiso of usuario.permisosDirectos) {
      if (permiso && permiso.activo && permiso.codigo) {
        permisos.add(permiso.codigo);
      }
    }
  }

  // Fallbacks basados en el enum legacy de rol si no tiene rol entidad o permisos cargados
  if (permisos.size === 0) {
    if (usuario.rol === RolUsuario.ADMINISTRADOR) {
      permisos.add('*');
    } else if (usuario.rol === RolUsuario.PACIENTE) {
      PERMISOS_DEFAULT_PACIENTE.forEach((p) => permisos.add(p));
    } else if (usuario.rol === RolUsuario.MEDICO) {
      PERMISOS_DEFAULT_MEDICO.forEach((p) => permisos.add(p));
    } else if (usuario.rol === RolUsuario.RECEPCIONISTA) {
      PERMISOS_DEFAULT_RECEPCIONISTA.forEach((p) => permisos.add(p));
    }
  }

  return Array.from(permisos);
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calcularPermisosConsolidados = calcularPermisosConsolidados;
const usuario_entity_1 = require("../autenticacion/entities/usuario.entity");
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
function calcularPermisosConsolidados(usuario) {
    const permisos = new Set();
    if (usuario.correoElectronico === 'admin@codepyme.com') {
        permisos.add('*');
        return Array.from(permisos);
    }
    if (usuario.rolEntidad && usuario.rolEntidad.activo && Array.isArray(usuario.rolEntidad.permisos)) {
        for (const permiso of usuario.rolEntidad.permisos) {
            if (permiso && permiso.activo && permiso.codigo) {
                permisos.add(permiso.codigo);
            }
        }
    }
    if (Array.isArray(usuario.permisosDirectos)) {
        for (const permiso of usuario.permisosDirectos) {
            if (permiso && permiso.activo && permiso.codigo) {
                permisos.add(permiso.codigo);
            }
        }
    }
    if (permisos.size === 0) {
        if (usuario.rol === usuario_entity_1.RolUsuario.ADMINISTRADOR) {
            permisos.add('*');
        }
        else if (usuario.rol === usuario_entity_1.RolUsuario.PACIENTE) {
            PERMISOS_DEFAULT_PACIENTE.forEach((p) => permisos.add(p));
        }
        else if (usuario.rol === usuario_entity_1.RolUsuario.MEDICO) {
            PERMISOS_DEFAULT_MEDICO.forEach((p) => permisos.add(p));
        }
        else if (usuario.rol === usuario_entity_1.RolUsuario.RECEPCIONISTA) {
            PERMISOS_DEFAULT_RECEPCIONISTA.forEach((p) => permisos.add(p));
        }
    }
    return Array.from(permisos);
}
//# sourceMappingURL=permisos.utils.js.map
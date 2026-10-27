"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CATALOGO_PERMISOS = void 0;
exports.CATALOGO_PERMISOS = [
    {
        codigo: 'dashboard.ver',
        nombre: 'Ver Dashboard',
        descripcion: 'Permite visualizar la página de inicio y métricas generales',
        modulo: 'dashboard',
    },
    {
        codigo: 'pacientes.ver',
        nombre: 'Ver Pacientes',
        descripcion: 'Permite ver la lista de pacientes y sus detalles',
        modulo: 'pacientes',
    },
    {
        codigo: 'pacientes.crear',
        nombre: 'Crear Pacientes',
        descripcion: 'Permite registrar nuevos pacientes manualmente',
        modulo: 'pacientes',
    },
    {
        codigo: 'pacientes.editar',
        nombre: 'Editar Pacientes',
        descripcion: 'Permite modificar los datos demográficos del paciente',
        modulo: 'pacientes',
    },
    {
        codigo: 'citas.ver',
        nombre: 'Ver Citas',
        descripcion: 'Permite consultar citas médicas programadas y pasadas',
        modulo: 'citas',
    },
    {
        codigo: 'citas.crear',
        nombre: 'Agendar Citas',
        descripcion: 'Permite solicitar o programar nuevas citas médicas',
        modulo: 'citas',
    },
    {
        codigo: 'citas.cancelar',
        nombre: 'Cancelar Citas',
        descripcion: 'Permite cancelar citas médicas existentes con motivo',
        modulo: 'citas',
    },
    {
        codigo: 'resultados.ver',
        nombre: 'Ver Resultados',
        descripcion: 'Permite consultar órdenes y exámenes de laboratorio e imagenología',
        modulo: 'resultados',
    },
    {
        codigo: 'resultados.descargar',
        nombre: 'Descargar Resultados',
        descripcion: 'Permite descargar reportes y PDFs de resultados diagnósticos',
        modulo: 'resultados',
    },
    {
        codigo: 'historia.ver',
        nombre: 'Ver Historia Clínica',
        descripcion: 'Permite consultar el historial de atenciones clínicas',
        modulo: 'historia',
    },
    {
        codigo: 'historia.descargar',
        nombre: 'Descargar Historia',
        descripcion: 'Permite exportar o imprimir reportes de historia clínica',
        modulo: 'historia',
    },
    {
        codigo: 'medicamentos.ver',
        nombre: 'Ver Medicamentos',
        descripcion: 'Permite consultar fórmulas y prescripciones médicas',
        modulo: 'medicamentos',
    },
    {
        codigo: 'usuarios.ver',
        nombre: 'Ver Usuarios de Plataforma',
        descripcion: 'Permite listar los usuarios administrativos del sistema',
        modulo: 'usuarios',
    },
    {
        codigo: 'usuarios.crear',
        nombre: 'Crear Usuarios',
        descripcion: 'Permite dar de alta a nuevos usuarios administrativos',
        modulo: 'usuarios',
    },
    {
        codigo: 'usuarios.editar',
        nombre: 'Editar Usuarios',
        descripcion: 'Permite editar datos, rol y permisos directos de un usuario',
        modulo: 'usuarios',
    },
    {
        codigo: 'usuarios.eliminar',
        nombre: 'Eliminar o Desactivar Usuarios',
        descripcion: 'Permite desactivar o remover usuarios administrativos',
        modulo: 'usuarios',
    },
    {
        codigo: 'roles.ver',
        nombre: 'Ver Roles',
        descripcion: 'Permite consultar los roles definidos en la plataforma',
        modulo: 'roles',
    },
    {
        codigo: 'roles.crear',
        nombre: 'Crear Roles',
        descripcion: 'Permite crear nuevos roles con perfiles de acceso',
        modulo: 'roles',
    },
    {
        codigo: 'roles.editar',
        nombre: 'Editar Roles y Permisos',
        descripcion: 'Permite asignar o remover permisos asociados a un rol',
        modulo: 'roles',
    },
    {
        codigo: 'roles.eliminar',
        nombre: 'Eliminar Roles',
        descripcion: 'Permite borrar roles personalizados sin usuarios asignados',
        modulo: 'roles',
    },
    {
        codigo: 'permisos.ver',
        nombre: 'Ver Catálogo de Permisos',
        descripcion: 'Permite visualizar todos los permisos del sistema',
        modulo: 'permisos',
    },
    {
        codigo: 'permisos.gestionar',
        nombre: 'Gestionar Permisos',
        descripcion: 'Permite crear o sincronizar permisos en la base de datos',
        modulo: 'permisos',
    },
    {
        codigo: 'configuracion.ver',
        nombre: 'Ver Configuración',
        descripcion: 'Permite ver los datos de personalización del tenant',
        modulo: 'configuracion',
    },
    {
        codigo: 'configuracion.editar',
        nombre: 'Editar Configuración',
        descripcion: 'Permite actualizar colores, logos y textos del portal',
        modulo: 'configuracion',
    },
];
//# sourceMappingURL=catalogo-permisos.js.map
import { PermisosService } from './permisos.service';
import { CrearPermisoDto } from './dto/crear-permiso.dto';
import { ActualizarPermisoDto } from './dto/actualizar-permiso.dto';
export declare class PermisosController {
    private readonly permisosService;
    constructor(permisosService: PermisosService);
    obtenerTodos(): Promise<import("../common/interfaces/respuesta-api.interface").RespuestaApi<import("./entities/permiso.entity").Permiso[]>>;
    obtenerPorModulo(): Promise<import("../common/interfaces/respuesta-api.interface").RespuestaApi<Record<string, import("./entities/permiso.entity").Permiso[]>>>;
    sincronizarCatalogo(): Promise<import("../common/interfaces/respuesta-api.interface").RespuestaApi<{
        creados: number;
        existentes: number;
    }>>;
    obtenerPorId(id: string): Promise<import("../common/interfaces/respuesta-api.interface").RespuestaApi<import("./entities/permiso.entity").Permiso>>;
    crear(crearPermisoDto: CrearPermisoDto): Promise<import("../common/interfaces/respuesta-api.interface").RespuestaApi<import("./entities/permiso.entity").Permiso>>;
    actualizar(id: string, actualizarPermisoDto: ActualizarPermisoDto): Promise<import("../common/interfaces/respuesta-api.interface").RespuestaApi<import("./entities/permiso.entity").Permiso>>;
    eliminar(id: string): Promise<import("../common/interfaces/respuesta-api.interface").RespuestaApi<null>>;
}

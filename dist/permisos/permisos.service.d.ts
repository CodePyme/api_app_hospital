import type { Request } from 'express';
import { Permiso } from './entities/permiso.entity';
import { CrearPermisoDto } from './dto/crear-permiso.dto';
import { ActualizarPermisoDto } from './dto/actualizar-permiso.dto';
import { RespuestaApi } from '../common/interfaces/respuesta-api.interface';
export declare class PermisosService {
    private readonly request;
    constructor(request: Request);
    private get repositorioPermiso();
    obtenerTodos(): Promise<RespuestaApi<Permiso[]>>;
    obtenerPorModulo(): Promise<RespuestaApi<Record<string, Permiso[]>>>;
    obtenerPorId(id: string): Promise<RespuestaApi<Permiso>>;
    crear(crearPermisoDto: CrearPermisoDto): Promise<RespuestaApi<Permiso>>;
    actualizar(id: string, actualizarPermisoDto: ActualizarPermisoDto): Promise<RespuestaApi<Permiso>>;
    eliminar(id: string): Promise<RespuestaApi<null>>;
    sincronizarCatalogo(): Promise<RespuestaApi<{
        creados: number;
        existentes: number;
    }>>;
}

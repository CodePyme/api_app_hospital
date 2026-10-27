import type { Request } from 'express';
import { Rol } from './entities/rol.entity';
import { CrearRolDto } from './dto/crear-rol.dto';
import { ActualizarRolDto } from './dto/actualizar-rol.dto';
import { RespuestaApi } from '../common/interfaces/respuesta-api.interface';
export declare class RolesService {
    private readonly request;
    constructor(request: Request);
    private get repositorioRol();
    private get repositorioPermiso();
    obtenerTodos(): Promise<RespuestaApi<any[]>>;
    obtenerPorId(id: string): Promise<RespuestaApi<Rol>>;
    crear(crearRolDto: CrearRolDto): Promise<RespuestaApi<Rol>>;
    actualizar(id: string, actualizarRolDto: ActualizarRolDto): Promise<RespuestaApi<Rol>>;
    eliminar(id: string): Promise<RespuestaApi<null>>;
}

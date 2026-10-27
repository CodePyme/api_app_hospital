import { RolesService } from './roles.service';
import { CrearRolDto } from './dto/crear-rol.dto';
import { ActualizarRolDto } from './dto/actualizar-rol.dto';
export declare class RolesController {
    private readonly rolesService;
    constructor(rolesService: RolesService);
    obtenerTodos(): Promise<import("../common/interfaces/respuesta-api.interface").RespuestaApi<any[]>>;
    obtenerPorId(id: string): Promise<import("../common/interfaces/respuesta-api.interface").RespuestaApi<import("./entities/rol.entity").Rol>>;
    crear(crearRolDto: CrearRolDto): Promise<import("../common/interfaces/respuesta-api.interface").RespuestaApi<import("./entities/rol.entity").Rol>>;
    actualizar(id: string, actualizarRolDto: ActualizarRolDto): Promise<import("../common/interfaces/respuesta-api.interface").RespuestaApi<import("./entities/rol.entity").Rol>>;
    eliminar(id: string): Promise<import("../common/interfaces/respuesta-api.interface").RespuestaApi<null>>;
}

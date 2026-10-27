import { UsuariosService } from './usuarios.service';
import { CrearUsuarioDto } from './dto/crear-usuario.dto';
import { ActualizarUsuarioDto } from './dto/actualizar-usuario.dto';
import { CambiarContrasenaDto } from './dto/cambiar-contrasena.dto';
export declare class UsuariosController {
    private readonly usuariosService;
    constructor(usuariosService: UsuariosService);
    obtenerUsuarios(incluirPacientes?: string): Promise<import("../common/interfaces/respuesta-api.interface").RespuestaApi<any[]>>;
    obtenerPorId(id: string): Promise<import("../common/interfaces/respuesta-api.interface").RespuestaApi<any>>;
    crear(crearUsuarioDto: CrearUsuarioDto): Promise<import("../common/interfaces/respuesta-api.interface").RespuestaApi<any>>;
    actualizar(id: string, actualizarUsuarioDto: ActualizarUsuarioDto): Promise<import("../common/interfaces/respuesta-api.interface").RespuestaApi<any>>;
    cambiarContrasena(id: string, cambiarContrasenaDto: CambiarContrasenaDto): Promise<import("../common/interfaces/respuesta-api.interface").RespuestaApi<null>>;
    eliminar(id: string): Promise<import("../common/interfaces/respuesta-api.interface").RespuestaApi<null>>;
}

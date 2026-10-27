import type { Request } from 'express';
import { CrearUsuarioDto } from './dto/crear-usuario.dto';
import { ActualizarUsuarioDto } from './dto/actualizar-usuario.dto';
import { CambiarContrasenaDto } from './dto/cambiar-contrasena.dto';
import { RespuestaApi } from '../common/interfaces/respuesta-api.interface';
export declare class UsuariosService {
    private readonly request;
    private readonly RONDAS_HASH;
    private readonly CORREO_SUPER_ADMIN;
    constructor(request: Request);
    private get repositorioUsuario();
    private get repositorioRol();
    private get repositorioPermiso();
    private get usuarioAutenticado();
    private get esSuperAdmin();
    obtenerUsuarios(incluirPacientes?: boolean): Promise<RespuestaApi<any[]>>;
    obtenerPorId(id: string): Promise<RespuestaApi<any>>;
    crear(crearUsuarioDto: CrearUsuarioDto): Promise<RespuestaApi<any>>;
    actualizar(id: string, actualizarUsuarioDto: ActualizarUsuarioDto): Promise<RespuestaApi<any>>;
    cambiarContrasena(id: string, dto: CambiarContrasenaDto): Promise<RespuestaApi<null>>;
    eliminar(id: string): Promise<RespuestaApi<null>>;
}

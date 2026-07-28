import { AutenticacionService } from './autenticacion.service';
import { IniciarSesionDto } from './dto/iniciar-sesion.dto';
import { RegistrarUsuarioDto } from './dto/registrar-usuario.dto';
import { Usuario } from './entities/usuario.entity';
export declare class AutenticacionController {
    private readonly autenticacionService;
    constructor(autenticacionService: AutenticacionService);
    registrarUsuario(registrarUsuarioDto: RegistrarUsuarioDto): Promise<import("../common/interfaces/respuesta-api.interface").RespuestaApi<Omit<Usuario, "contrasena">>>;
    iniciarSesion(iniciarSesionDto: IniciarSesionDto): Promise<import("../common/interfaces/respuesta-api.interface").RespuestaApi<{
        token: string;
        usuario: Omit<Usuario, "contrasena">;
    }>>;
    obtenerPerfil(usuario: Usuario): Promise<import("../common/interfaces/respuesta-api.interface").RespuestaApi<Omit<Usuario, "contrasena">>>;
}

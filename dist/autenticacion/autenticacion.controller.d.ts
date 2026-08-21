import { AutenticacionService } from './autenticacion.service';
import { IniciarSesionDto } from './dto/iniciar-sesion.dto';
import { RegistrarUsuarioDto } from './dto/registrar-usuario.dto';
import { SolicitarOtpDto } from './dto/solicitar-otp.dto';
import { VerificarOtpDto } from './dto/verificar-otp.dto';
import { Usuario } from './entities/usuario.entity';
export declare class AutenticacionController {
    private readonly autenticacionService;
    constructor(autenticacionService: AutenticacionService);
    solicitarOtp(solicitarOtpDto: SolicitarOtpDto): Promise<import("../common/interfaces/respuesta-api.interface").RespuestaApi<{
        correoDestino?: string;
        correoEnmascarado: string;
        telefonoEnmascarado: string | null;
        expiraEn: Date;
    }>>;
    verificarOtp(verificarOtpDto: VerificarOtpDto): Promise<import("../common/interfaces/respuesta-api.interface").RespuestaApi<{
        token: string;
        usuario: Omit<Usuario, "contrasena">;
        paciente: import("../pacientes/entities/paciente.entity").Paciente;
    }>>;
    registrarUsuario(registrarUsuarioDto: RegistrarUsuarioDto): Promise<import("../common/interfaces/respuesta-api.interface").RespuestaApi<Omit<Usuario, "contrasena">>>;
    iniciarSesion(iniciarSesionDto: IniciarSesionDto): Promise<import("../common/interfaces/respuesta-api.interface").RespuestaApi<{
        token: string;
        usuario: Omit<Usuario, "contrasena">;
    }>>;
    obtenerPerfil(usuario: Usuario): Promise<import("../common/interfaces/respuesta-api.interface").RespuestaApi<Omit<Usuario, "contrasena">>>;
}

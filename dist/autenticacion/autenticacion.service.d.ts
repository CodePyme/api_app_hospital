import type { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { Usuario } from './entities/usuario.entity';
import { Paciente } from '../pacientes/entities/paciente.entity';
import { IniciarSesionDto } from './dto/iniciar-sesion.dto';
import { RegistrarUsuarioDto } from './dto/registrar-usuario.dto';
import { ConfigService } from '@nestjs/config';
import { SolicitarOtpDto } from './dto/solicitar-otp.dto';
import { VerificarOtpDto } from './dto/verificar-otp.dto';
import { RespuestaApi } from '../common/interfaces/respuesta-api.interface';
import { CorreoService } from './services/correo.service';
import { IntegracionHospitalService } from './services/integracion-hospital.service';
export declare class AutenticacionService {
    private readonly request;
    private readonly servicioJwt;
    private readonly correoService;
    private readonly hospitalService;
    private readonly configService;
    private readonly logger;
    private readonly RONDAS_HASH;
    private readonly MINUTOS_EXPIRACION_OTP;
    private readonly MAX_INTENTOS_OTP;
    constructor(request: Request, servicioJwt: JwtService, correoService: CorreoService, hospitalService: IntegracionHospitalService, configService: ConfigService);
    private get repositorioUsuario();
    private get repositorioOtp();
    private get repositorioPaciente();
    solicitarOtp(solicitarOtpDto: SolicitarOtpDto): Promise<RespuestaApi<{
        correoDestino?: string;
        correoEnmascarado: string;
        telefonoEnmascarado: string | null;
        expiraEn: Date;
    }>>;
    verificarOtp(verificarOtpDto: VerificarOtpDto): Promise<RespuestaApi<{
        token: string;
        usuario: Omit<Usuario, 'contrasena'>;
        paciente: Paciente;
    }>>;
    registrarUsuario(registrarUsuarioDto: RegistrarUsuarioDto): Promise<RespuestaApi<Omit<Usuario, 'contrasena'>>>;
    iniciarSesion(iniciarSesionDto: IniciarSesionDto): Promise<RespuestaApi<{
        token: string;
        usuario: Omit<Usuario, 'contrasena'>;
    }>>;
    obtenerPerfilUsuario(usuario: Usuario): Promise<RespuestaApi<Omit<Usuario, 'contrasena'>>>;
    private enmascararCorreo;
    private enmascararTelefono;
}

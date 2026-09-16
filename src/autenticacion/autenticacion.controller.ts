import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AutenticacionService } from './autenticacion.service';
import { IniciarSesionDto } from './dto/iniciar-sesion.dto';
import { RegistrarUsuarioDto } from './dto/registrar-usuario.dto';
import { SolicitarOtpDto } from './dto/solicitar-otp.dto';
import { VerificarOtpDto } from './dto/verificar-otp.dto';
import { GuardJwtAutenticacion } from '../common/guards/jwt-autenticacion.guard';
import { UsuarioActual } from '../common/decorators/usuario-actual.decorator';
import { Usuario } from './entities/usuario.entity';

@Controller('autenticacion')
export class AutenticacionController {
  constructor(private readonly autenticacionService: AutenticacionService) {}

  /**
   * Solicitar código OTP de 4 dígitos para autenticación de paciente
   * POST /api/v1/autenticacion/solicitar-otp
   */
  // Límite estricto: el OTP tiene solo 9000 combinaciones posibles; sin esto,
  // el límite global (100 req/min) permite generar OTPs a un ritmo peligroso.
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('solicitar-otp')
  async solicitarOtp(@Body() solicitarOtpDto: SolicitarOtpDto) {
    return this.autenticacionService.solicitarOtp(solicitarOtpDto);
  }

  /**
   * Verificar código OTP de 4 dígitos e iniciar sesión
   * POST /api/v1/autenticacion/verificar-otp
   */
  // Límite estricto adicional a los 3 intentos por código: evita que un atacante
  // agote códigos de múltiples solicitudes a alta velocidad (fuerza bruta del OTP).
  @Throttle({ default: { limit: 8, ttl: 60000 } })
  @Post('verificar-otp')
  async verificarOtp(@Body() verificarOtpDto: VerificarOtpDto) {
    return this.autenticacionService.verificarOtp(verificarOtpDto);
  }

  /**
   * Registro de usuario administrativo
   * POST /api/v1/autenticacion/registrar
   */
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('registrar')
  async registrarUsuario(@Body() registrarUsuarioDto: RegistrarUsuarioDto) {
    return this.autenticacionService.registrarUsuario(registrarUsuarioDto);
  }

  /**
   * Inicio de sesión tradicional (correo/contraseña)
   * POST /api/v1/autenticacion/iniciar-sesion
   */
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('iniciar-sesion')
  async iniciarSesion(@Body() iniciarSesionDto: IniciarSesionDto) {
    return this.autenticacionService.iniciarSesion(iniciarSesionDto);
  }

  /**
   * Perfil del usuario autenticado
   * GET /api/v1/autenticacion/perfil
   */
  @UseGuards(GuardJwtAutenticacion)
  @Get('perfil')
  async obtenerPerfil(@UsuarioActual() usuario: Usuario) {
    return this.autenticacionService.obtenerPerfilUsuario(usuario);
  }
}

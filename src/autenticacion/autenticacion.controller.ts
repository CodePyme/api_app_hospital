import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
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
  @Post('solicitar-otp')
  async solicitarOtp(@Body() solicitarOtpDto: SolicitarOtpDto) {
    return this.autenticacionService.solicitarOtp(solicitarOtpDto);
  }

  /**
   * Verificar código OTP de 4 dígitos e iniciar sesión
   * POST /api/v1/autenticacion/verificar-otp
   */
  @Post('verificar-otp')
  async verificarOtp(@Body() verificarOtpDto: VerificarOtpDto) {
    return this.autenticacionService.verificarOtp(verificarOtpDto);
  }

  /**
   * Registro de usuario administrativo
   * POST /api/v1/autenticacion/registrar
   */
  @Post('registrar')
  async registrarUsuario(@Body() registrarUsuarioDto: RegistrarUsuarioDto) {
    return this.autenticacionService.registrarUsuario(registrarUsuarioDto);
  }

  /**
   * Inicio de sesión tradicional (correo/contraseña)
   * POST /api/v1/autenticacion/iniciar-sesion
   */
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

import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AutenticacionService } from './autenticacion.service';
import { IniciarSesionDto } from './dto/iniciar-sesion.dto';
import { RegistrarUsuarioDto } from './dto/registrar-usuario.dto';
import { GuardJwtAutenticacion } from '../common/guards/jwt-autenticacion.guard';
import { UsuarioActual } from '../common/decorators/usuario-actual.decorator';
import { Usuario } from './entities/usuario.entity';

@Controller('autenticacion')
export class AutenticacionController {
  constructor(private readonly autenticacionService: AutenticacionService) {}

  @Post('registrar')
  async registrarUsuario(@Body() registrarUsuarioDto: RegistrarUsuarioDto) {
    return this.autenticacionService.registrarUsuario(registrarUsuarioDto);
  }

  @Post('iniciar-sesion')
  async iniciarSesion(@Body() iniciarSesionDto: IniciarSesionDto) {
    return this.autenticacionService.iniciarSesion(iniciarSesionDto);
  }

  @UseGuards(GuardJwtAutenticacion)
  @Get('perfil')
  async obtenerPerfil(@UsuarioActual() usuario: Usuario) {
    return this.autenticacionService.obtenerPerfilUsuario(usuario);
  }
}

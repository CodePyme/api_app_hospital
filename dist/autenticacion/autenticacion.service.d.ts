import type { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { Usuario } from './entities/usuario.entity';
import { IniciarSesionDto } from './dto/iniciar-sesion.dto';
import { RegistrarUsuarioDto } from './dto/registrar-usuario.dto';
import { RespuestaApi } from '../common/interfaces/respuesta-api.interface';
export declare class AutenticacionService {
    private readonly request;
    private readonly servicioJwt;
    private readonly RONDAS_HASH;
    constructor(request: Request, servicioJwt: JwtService);
    private get repositorioUsuario();
    registrarUsuario(registrarUsuarioDto: RegistrarUsuarioDto): Promise<RespuestaApi<Omit<Usuario, 'contrasena'>>>;
    iniciarSesion(iniciarSesionDto: IniciarSesionDto): Promise<RespuestaApi<{
        token: string;
        usuario: Omit<Usuario, 'contrasena'>;
    }>>;
    obtenerPerfilUsuario(usuario: Usuario): Promise<RespuestaApi<Omit<Usuario, 'contrasena'>>>;
}

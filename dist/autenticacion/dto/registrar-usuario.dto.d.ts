import { RolUsuario } from '../entities/usuario.entity';
export declare class RegistrarUsuarioDto {
    nombres: string;
    apellidos: string;
    correoElectronico: string;
    contrasena: string;
    rol?: RolUsuario;
}

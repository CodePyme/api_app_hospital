import { Rol } from '../../roles/entities/rol.entity';
import { Permiso } from '../../permisos/entities/permiso.entity';
export declare enum RolUsuario {
    ADMINISTRADOR = "administrador",
    MEDICO = "medico",
    RECEPCIONISTA = "recepcionista",
    PACIENTE = "paciente"
}
export declare class Usuario {
    id: string;
    nombres: string;
    apellidos: string;
    correoElectronico: string;
    contrasena: string;
    rol: RolUsuario;
    rolId?: string | null;
    rolEntidad?: Rol | null;
    permisosDirectos?: Permiso[];
    activo: boolean;
    creadoEn: Date;
    actualizadoEn: Date;
}

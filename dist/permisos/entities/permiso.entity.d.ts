import { Rol } from '../../roles/entities/rol.entity';
import { Usuario } from '../../autenticacion/entities/usuario.entity';
export declare class Permiso {
    id: string;
    codigo: string;
    nombre: string;
    descripcion: string;
    modulo: string;
    activo: boolean;
    roles: Rol[];
    usuarios: Usuario[];
    creadoEn: Date;
    actualizadoEn: Date;
}

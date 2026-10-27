import { Permiso } from '../../permisos/entities/permiso.entity';
import { Usuario } from '../../autenticacion/entities/usuario.entity';
export declare class Rol {
    id: string;
    codigo: string;
    nombre: string;
    descripcion: string;
    esSistema: boolean;
    activo: boolean;
    permisos: Permiso[];
    usuarios: Usuario[];
    creadoEn: Date;
    actualizadoEn: Date;
}

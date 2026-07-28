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
    activo: boolean;
    creadoEn: Date;
    actualizadoEn: Date;
}

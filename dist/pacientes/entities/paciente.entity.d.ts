import { Cita } from '../../citas/entities/cita.entity';
export declare enum GeneroPaciente {
    MASCULINO = "masculino",
    FEMENINO = "femenino",
    OTRO = "otro"
}
export declare enum EstadoPaciente {
    ACTIVO = "activo",
    INACTIVO = "inactivo"
}
export declare class Paciente {
    id: string;
    nombres: string;
    apellidos: string;
    numeroDocumento: string;
    tipoDocumento: string;
    fechaNacimiento: Date;
    genero: GeneroPaciente;
    correoElectronico: string;
    telefono: string;
    direccion: string;
    ciudad: string;
    estado: EstadoPaciente;
    observaciones: string;
    creadoEn: Date;
    actualizadoEn: Date;
    citas: Cita[];
}

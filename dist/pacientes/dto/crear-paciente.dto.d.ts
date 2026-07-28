import { GeneroPaciente } from '../entities/paciente.entity';
export declare class CrearPacienteDto {
    nombres: string;
    apellidos: string;
    numeroDocumento: string;
    tipoDocumento?: string;
    fechaNacimiento: string;
    genero?: GeneroPaciente;
    correoElectronico?: string;
    telefono?: string;
    direccion?: string;
    ciudad?: string;
    observaciones?: string;
}

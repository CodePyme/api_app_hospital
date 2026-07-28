import { CrearPacienteDto } from './crear-paciente.dto';
import { EstadoPaciente } from '../entities/paciente.entity';
declare const ActualizarPacienteDto_base: import("@nestjs/mapped-types").MappedType<Partial<CrearPacienteDto>>;
export declare class ActualizarPacienteDto extends ActualizarPacienteDto_base {
    estado?: EstadoPaciente;
}
export {};

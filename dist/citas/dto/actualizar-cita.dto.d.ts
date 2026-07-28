import { CrearCitaDto } from './crear-cita.dto';
import { EstadoCita } from '../entities/cita.entity';
declare const ActualizarCitaDto_base: import("@nestjs/mapped-types").MappedType<Partial<CrearCitaDto>>;
export declare class ActualizarCitaDto extends ActualizarCitaDto_base {
    estado?: EstadoCita;
}
export {};

import type { Request } from 'express';
import { Paciente } from './entities/paciente.entity';
import { CrearPacienteDto } from './dto/crear-paciente.dto';
import { ActualizarPacienteDto } from './dto/actualizar-paciente.dto';
import { RespuestaApi, RespuestaPaginada } from '../common/interfaces/respuesta-api.interface';
export declare class PacientesService {
    private readonly request;
    constructor(request: Request);
    private get repositorioPaciente();
    crearPaciente(crearPacienteDto: CrearPacienteDto): Promise<RespuestaApi<Paciente>>;
    obtenerTodosPacientes(pagina?: number, limite?: number): Promise<RespuestaPaginada<Paciente>>;
    obtenerPacientePorId(id: string): Promise<RespuestaApi<Paciente>>;
    actualizarPaciente(id: string, actualizarPacienteDto: ActualizarPacienteDto): Promise<RespuestaApi<Paciente>>;
    eliminarPaciente(id: string): Promise<RespuestaApi<null>>;
    buscarPacientes(termino: string): Promise<RespuestaApi<Paciente[]>>;
}

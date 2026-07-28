import { PacientesService } from './pacientes.service';
import { CrearPacienteDto } from './dto/crear-paciente.dto';
import { ActualizarPacienteDto } from './dto/actualizar-paciente.dto';
export declare class PacientesController {
    private readonly pacientesService;
    constructor(pacientesService: PacientesService);
    crearPaciente(crearPacienteDto: CrearPacienteDto): Promise<import("../common/interfaces/respuesta-api.interface").RespuestaApi<import("./entities/paciente.entity").Paciente>>;
    obtenerTodosPacientes(pagina?: string, limite?: string): Promise<import("../common/interfaces/respuesta-api.interface").RespuestaPaginada<import("./entities/paciente.entity").Paciente>>;
    buscarPacientes(termino: string): Promise<import("../common/interfaces/respuesta-api.interface").RespuestaApi<import("./entities/paciente.entity").Paciente[]>>;
    obtenerPacientePorId(id: string): Promise<import("../common/interfaces/respuesta-api.interface").RespuestaApi<import("./entities/paciente.entity").Paciente>>;
    actualizarPaciente(id: string, actualizarPacienteDto: ActualizarPacienteDto): Promise<import("../common/interfaces/respuesta-api.interface").RespuestaApi<import("./entities/paciente.entity").Paciente>>;
    eliminarPaciente(id: string): Promise<import("../common/interfaces/respuesta-api.interface").RespuestaApi<null>>;
}

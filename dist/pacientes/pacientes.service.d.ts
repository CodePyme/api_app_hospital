import type { Request } from 'express';
import { Paciente } from './entities/paciente.entity';
import { CrearPacienteDto } from './dto/crear-paciente.dto';
import { ActualizarPacienteDto } from './dto/actualizar-paciente.dto';
import { RespuestaApi, RespuestaPaginada } from '../common/interfaces/respuesta-api.interface';
import { IntegracionHospitalService } from '../autenticacion/services/integracion-hospital.service';
export declare class PacientesService {
    private readonly request;
    private readonly integracionHospitalService;
    private readonly logger;
    constructor(request: Request, integracionHospitalService: IntegracionHospitalService);
    private get repositorioPaciente();
    crearPaciente(crearPacienteDto: CrearPacienteDto): Promise<RespuestaApi<Paciente>>;
    obtenerTodosPacientes(pagina?: number, limite?: number): Promise<RespuestaPaginada<Paciente>>;
    obtenerPacientePorId(id: string): Promise<RespuestaApi<Paciente>>;
    actualizarPaciente(id: string, actualizarPacienteDto: ActualizarPacienteDto): Promise<RespuestaApi<Paciente>>;
    eliminarPaciente(id: string): Promise<RespuestaApi<null>>;
    obtenerMiPerfil(usuario: any): Promise<RespuestaApi<any>>;
    consultarPorEpisodio(episodio: string): Promise<RespuestaApi<any>>;
    buscarPacientes(termino: string): Promise<RespuestaApi<Paciente[]>>;
}

import type { Request } from 'express';
import { Cita } from './entities/cita.entity';
import { CrearCitaDto } from './dto/crear-cita.dto';
import { ActualizarCitaDto } from './dto/actualizar-cita.dto';
import { RespuestaApi, RespuestaPaginada } from '../common/interfaces/respuesta-api.interface';
import { PacientesService } from '../pacientes/pacientes.service';
export declare class CitasService {
    private readonly request;
    private readonly pacientesService;
    constructor(request: Request, pacientesService: PacientesService);
    private get repositorioCita();
    crearCita(crearCitaDto: CrearCitaDto): Promise<RespuestaApi<Cita>>;
    obtenerTodasLasCitas(pagina?: number, limite?: number): Promise<RespuestaPaginada<Cita>>;
    obtenerCitaPorId(id: string): Promise<RespuestaApi<Cita>>;
    obtenerCitasPorPaciente(pacienteId: string): Promise<RespuestaApi<Cita[]>>;
    actualizarCita(id: string, actualizarCitaDto: ActualizarCitaDto): Promise<RespuestaApi<Cita>>;
    cancelarCita(id: string): Promise<RespuestaApi<Cita>>;
    eliminarCita(id: string): Promise<RespuestaApi<null>>;
}

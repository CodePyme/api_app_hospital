import { CitasService } from './citas.service';
import { CrearCitaDto } from './dto/crear-cita.dto';
import { ActualizarCitaDto } from './dto/actualizar-cita.dto';
export declare class CitasController {
    private readonly citasService;
    constructor(citasService: CitasService);
    crearCita(crearCitaDto: CrearCitaDto): Promise<import("../common/interfaces/respuesta-api.interface").RespuestaApi<import("./entities/cita.entity").Cita>>;
    obtenerTodasLasCitas(pagina?: string, limite?: string): Promise<import("../common/interfaces/respuesta-api.interface").RespuestaPaginada<import("./entities/cita.entity").Cita>>;
    obtenerCitasPorPaciente(pacienteId: string): Promise<import("../common/interfaces/respuesta-api.interface").RespuestaApi<import("./entities/cita.entity").Cita[]>>;
    obtenerCitaPorId(id: string): Promise<import("../common/interfaces/respuesta-api.interface").RespuestaApi<import("./entities/cita.entity").Cita>>;
    actualizarCita(id: string, actualizarCitaDto: ActualizarCitaDto): Promise<import("../common/interfaces/respuesta-api.interface").RespuestaApi<import("./entities/cita.entity").Cita>>;
    cancelarCita(id: string): Promise<import("../common/interfaces/respuesta-api.interface").RespuestaApi<import("./entities/cita.entity").Cita>>;
    eliminarCita(id: string): Promise<import("../common/interfaces/respuesta-api.interface").RespuestaApi<null>>;
}

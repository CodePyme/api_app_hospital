import type { Request } from 'express';
import { CitasService } from './citas.service';
import { CrearCitaDto } from './dto/crear-cita.dto';
import { ActualizarCitaDto } from './dto/actualizar-cita.dto';
import { CancelarCitaDto } from './dto/cancelar-cita.dto';
export declare class CitasController {
    private readonly citasService;
    constructor(citasService: CitasService);
    obtenerMisCitas(req: Request): Promise<import("../common/interfaces/respuesta-api.interface").RespuestaApi<import("./services/integracion-citas-hospital.service").DetalleCitaSap[]>>;
    cancelarCitaPaciente(req: Request, cancelarCitaDto: CancelarCitaDto): Promise<import("../common/interfaces/respuesta-api.interface").RespuestaApi<import("./entities/auditoria-cancelacion-cita.entity").AuditoriaCancelacionCita>>;
    crearCita(crearCitaDto: CrearCitaDto): Promise<import("../common/interfaces/respuesta-api.interface").RespuestaApi<import("./entities/cita.entity").Cita>>;
    obtenerTodasLasCitas(req: Request, pagina?: string, limite?: string): Promise<any>;
    obtenerCitasPorPaciente(pacienteId: string): Promise<import("../common/interfaces/respuesta-api.interface").RespuestaApi<any>>;
    obtenerCitaPorId(id: string): Promise<import("../common/interfaces/respuesta-api.interface").RespuestaApi<import("./entities/cita.entity").Cita>>;
    actualizarCita(id: string, actualizarCitaDto: ActualizarCitaDto): Promise<import("../common/interfaces/respuesta-api.interface").RespuestaApi<import("./entities/cita.entity").Cita>>;
    cancelarCita(id: string): Promise<import("../common/interfaces/respuesta-api.interface").RespuestaApi<import("./entities/cita.entity").Cita>>;
    eliminarCita(id: string): Promise<import("../common/interfaces/respuesta-api.interface").RespuestaApi<null>>;
}

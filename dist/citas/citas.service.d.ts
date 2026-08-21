import type { Request } from 'express';
import { Cita } from './entities/cita.entity';
import { AuditoriaCancelacionCita } from './entities/auditoria-cancelacion-cita.entity';
import { CrearCitaDto } from './dto/crear-cita.dto';
import { ActualizarCitaDto } from './dto/actualizar-cita.dto';
import { CancelarCitaDto } from './dto/cancelar-cita.dto';
import { RespuestaApi } from '../common/interfaces/respuesta-api.interface';
import { PacientesService } from '../pacientes/pacientes.service';
import { IntegracionCitasHospitalService, DetalleCitaSap } from './services/integracion-citas-hospital.service';
export declare class CitasService {
    private readonly request;
    private readonly pacientesService;
    private readonly integracionCitasService;
    private readonly logger;
    constructor(request: Request, pacientesService: PacientesService, integracionCitasService: IntegracionCitasHospitalService);
    private get repositorioCita();
    private get repositorioPaciente();
    private get repositorioAuditoria();
    obtenerMisCitas(usuario: any): Promise<RespuestaApi<DetalleCitaSap[]>>;
    cancelarCitaPaciente(dto: CancelarCitaDto, usuario: any, ipUsuario?: string, userAgent?: string): Promise<RespuestaApi<AuditoriaCancelacionCita>>;
    crearCita(crearCitaDto: CrearCitaDto): Promise<RespuestaApi<Cita>>;
    obtenerTodasLasCitas(pagina?: number, limite?: number, usuario?: any): Promise<any>;
    obtenerCitaPorId(id: string): Promise<RespuestaApi<Cita>>;
    obtenerCitasPorPaciente(pacienteId: string): Promise<RespuestaApi<any>>;
    actualizarCita(id: string, actualizarCitaDto: ActualizarCitaDto): Promise<RespuestaApi<Cita>>;
    cancelarCita(id: string): Promise<RespuestaApi<Cita>>;
    eliminarCita(id: string): Promise<RespuestaApi<null>>;
}

"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var CitasService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CitasService = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const cita_entity_1 = require("./entities/cita.entity");
const auditoria_cancelacion_cita_entity_1 = require("./entities/auditoria-cancelacion-cita.entity");
const pacientes_service_1 = require("../pacientes/pacientes.service");
const paciente_entity_1 = require("../pacientes/entities/paciente.entity");
const integracion_citas_hospital_service_1 = require("./services/integracion-citas-hospital.service");
const DESCRIPCIONES_MOTIVOS = {
    M02: 'Condición clínica del paciente',
    M04: 'Paciente fallece',
    M09: 'Mejoría de estado de salud del paciente',
    M11: 'Paciente no acepta / No puede asistir',
    N22: 'Paciente no preparado para la atención',
    N23: 'Paciente hospitalizado',
    N26: 'Inconvenientes de transporte o económicos',
    N38: 'No aplica / No contrato',
};
let CitasService = CitasService_1 = class CitasService {
    request;
    pacientesService;
    integracionCitasService;
    logger = new common_1.Logger(CitasService_1.name);
    constructor(request, pacientesService, integracionCitasService) {
        this.request = request;
        this.pacientesService = pacientesService;
        this.integracionCitasService = integracionCitasService;
    }
    get repositorioCita() {
        return this.request.tenantConexion.getRepository(cita_entity_1.Cita);
    }
    get repositorioPaciente() {
        return this.request.tenantConexion.getRepository(paciente_entity_1.Paciente);
    }
    get repositorioAuditoria() {
        return this.request.tenantConexion.getRepository(auditoria_cancelacion_cita_entity_1.AuditoriaCancelacionCita);
    }
    async obtenerMisCitas(usuario) {
        let tipoDocumento = usuario?.tipoDocumento;
        let numeroDocumento = usuario?.numeroDocumento;
        if (!numeroDocumento) {
            const paciente = await this.repositorioPaciente.findOne({
                where: [
                    { correoElectronico: usuario?.correoElectronico },
                    { id: usuario?.pacienteId },
                ],
            });
            if (paciente) {
                tipoDocumento = paciente.tipoDocumento;
                numeroDocumento = paciente.numeroDocumento;
            }
        }
        if (!numeroDocumento) {
            return {
                exito: false,
                mensaje: 'No se encontró la identificación del paciente asociado a esta cuenta.',
                datos: [],
            };
        }
        this.logger.log(`📅 Consultando citas para paciente doc: ${numeroDocumento} (${tipoDocumento})`);
        const resultadoSap = await this.integracionCitasService.consultarAgendaPaciente({
            tipoDocumento: tipoDocumento || 'CC',
            numeroDocumento,
        });
        return {
            exito: true,
            mensaje: resultadoSap.message || 'Agenda obtenida exitosamente',
            datos: resultadoSap.citas,
        };
    }
    async cancelarCitaPaciente(dto, usuario, ipUsuario, userAgent) {
        let tipoDocumento = usuario?.tipoDocumento || 'CC';
        let numeroDocumento = usuario?.numeroDocumento;
        let nombrePaciente = `${usuario?.nombres || ''} ${usuario?.apellidos || ''}`.trim();
        let pacienteId = usuario?.pacienteId;
        if (!numeroDocumento) {
            const paciente = await this.repositorioPaciente.findOne({
                where: [
                    { correoElectronico: usuario?.correoElectronico },
                    { id: usuario?.pacienteId },
                ],
            });
            if (paciente) {
                tipoDocumento = paciente.tipoDocumento;
                numeroDocumento = paciente.numeroDocumento;
                nombrePaciente = `${paciente.nombres} ${paciente.apellidos}`.trim();
                pacienteId = paciente.id;
            }
        }
        this.logger.log(`🚫 Cancelando cita SAP ${dto.idCita} para paciente: ${numeroDocumento}`);
        const resSap = await this.integracionCitasService.cancelarCitaSAP({
            idCita: dto.idCita,
            idMotivo: dto.idMotivo,
        });
        const descMotivo = DESCRIPCIONES_MOTIVOS[dto.idMotivo] || `Motivo ${dto.idMotivo}`;
        const auditoria = this.repositorioAuditoria.create({
            idCita: dto.idCita,
            pacienteId,
            usuarioId: usuario?.id,
            numeroDocumento: numeroDocumento || 'Desconocido',
            tipoDocumento: tipoDocumento || 'CC',
            nombrePaciente: nombrePaciente || 'Paciente',
            idMotivo: dto.idMotivo,
            descripcionMotivo: descMotivo,
            observaciones: dto.observaciones || undefined,
            limiteHoras: 24,
            codigoRespuestaSap: resSap.idMessage,
            mensajeRespuestaSap: resSap.message,
            exitosa: resSap.exitosa,
            ipUsuario,
            userAgent,
            datosCita: dto.datosCita || undefined,
        });
        const auditoriaGuardada = await this.repositorioAuditoria.save(auditoria);
        this.logger.log(`📝 Auditoría de cancelación guardada en BD con ID: ${auditoriaGuardada.id}`);
        if (!resSap.exitosa) {
            throw new common_1.BadRequestException(resSap.message || 'No fue posible cancelar la cita médica.');
        }
        return {
            exito: true,
            mensaje: resSap.message || 'Cancelación de cita procesada exitosamente.',
            datos: auditoriaGuardada,
        };
    }
    async crearCita(crearCitaDto) {
        await this.pacientesService.obtenerPacientePorId(crearCitaDto.pacienteId);
        const nuevaCita = this.repositorioCita.create(crearCitaDto);
        const citaGuardada = await this.repositorioCita.save(nuevaCita);
        return {
            exito: true,
            mensaje: 'Cita creada exitosamente',
            datos: citaGuardada,
        };
    }
    async obtenerTodasLasCitas(pagina = 1, limite = 10, usuario) {
        if (usuario?.rol === 'paciente') {
            return this.obtenerMisCitas(usuario);
        }
        const salto = (pagina - 1) * limite;
        const [listaCitas, total] = await this.repositorioCita.findAndCount({
            relations: { paciente: true },
            order: { fechaCita: 'DESC' },
            skip: salto,
            take: limite,
        });
        return {
            exito: true,
            mensaje: 'Lista de citas obtenida exitosamente',
            datos: listaCitas,
            total,
            pagina,
            limite,
            totalPaginas: Math.ceil(total / limite),
        };
    }
    async obtenerCitaPorId(id) {
        const cita = await this.repositorioCita.findOne({
            where: { id },
            relations: { paciente: true },
        });
        if (!cita) {
            throw new common_1.NotFoundException(`Cita con ID ${id} no encontrada`);
        }
        return {
            exito: true,
            mensaje: 'Cita obtenida exitosamente',
            datos: cita,
        };
    }
    async obtenerCitasPorPaciente(pacienteId) {
        const paciente = await this.repositorioPaciente.findOne({
            where: { id: pacienteId },
        });
        if (paciente) {
            const resultadoSap = await this.integracionCitasService.consultarAgendaPaciente({
                tipoDocumento: paciente.tipoDocumento || 'CC',
                numeroDocumento: paciente.numeroDocumento,
            });
            if (resultadoSap.citas && resultadoSap.citas.length > 0) {
                return {
                    exito: true,
                    mensaje: resultadoSap.message,
                    datos: resultadoSap.citas,
                };
            }
        }
        const citas = await this.repositorioCita.find({
            where: { pacienteId },
            order: { fechaCita: 'DESC' },
        });
        return {
            exito: true,
            mensaje: `Se encontraron ${citas.length} cita(s) para el paciente`,
            datos: citas,
        };
    }
    async actualizarCita(id, actualizarCitaDto) {
        const respuesta = await this.obtenerCitaPorId(id);
        const cita = respuesta.datos;
        if (actualizarCitaDto.pacienteId) {
            await this.pacientesService.obtenerPacientePorId(actualizarCitaDto.pacienteId);
        }
        Object.assign(cita, actualizarCitaDto);
        const citaActualizada = await this.repositorioCita.save(cita);
        return {
            exito: true,
            mensaje: 'Cita actualizada exitosamente',
            datos: citaActualizada,
        };
    }
    async cancelarCita(id) {
        const respuesta = await this.obtenerCitaPorId(id);
        const cita = respuesta.datos;
        cita.estado = cita_entity_1.EstadoCita.CANCELADA;
        const citaCancelada = await this.repositorioCita.save(cita);
        return {
            exito: true,
            mensaje: 'Cita cancelada exitosamente',
            datos: citaCancelada,
        };
    }
    async eliminarCita(id) {
        const respuesta = await this.obtenerCitaPorId(id);
        const cita = respuesta.datos;
        await this.repositorioCita.remove(cita);
        return {
            exito: true,
            mensaje: 'Cita eliminada exitosamente',
        };
    }
};
exports.CitasService = CitasService;
exports.CitasService = CitasService = CitasService_1 = __decorate([
    (0, common_1.Injectable)({ scope: common_1.Scope.REQUEST }),
    __param(0, (0, common_1.Inject)(core_1.REQUEST)),
    __metadata("design:paramtypes", [Object, pacientes_service_1.PacientesService,
        integracion_citas_hospital_service_1.IntegracionCitasHospitalService])
], CitasService);
//# sourceMappingURL=citas.service.js.map
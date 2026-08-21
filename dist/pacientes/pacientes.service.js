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
var PacientesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PacientesService = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const paciente_entity_1 = require("./entities/paciente.entity");
const integracion_hospital_service_1 = require("../autenticacion/services/integracion-hospital.service");
let PacientesService = PacientesService_1 = class PacientesService {
    request;
    integracionHospitalService;
    logger = new common_1.Logger(PacientesService_1.name);
    constructor(request, integracionHospitalService) {
        this.request = request;
        this.integracionHospitalService = integracionHospitalService;
    }
    get repositorioPaciente() {
        return this.request.tenantConexion.getRepository(paciente_entity_1.Paciente);
    }
    async crearPaciente(crearPacienteDto) {
        const pacienteExistente = await this.repositorioPaciente.findOne({
            where: { numeroDocumento: crearPacienteDto.numeroDocumento },
        });
        if (pacienteExistente) {
            throw new common_1.ConflictException(`Ya existe un paciente con el documento ${crearPacienteDto.numeroDocumento}`);
        }
        const nuevoPaciente = this.repositorioPaciente.create(crearPacienteDto);
        const pacienteGuardado = await this.repositorioPaciente.save(nuevoPaciente);
        return {
            exito: true,
            mensaje: 'Paciente creado exitosamente',
            datos: pacienteGuardado,
        };
    }
    async obtenerTodosPacientes(pagina = 1, limite = 10) {
        const salto = (pagina - 1) * limite;
        const [listaPacientes, total] = await this.repositorioPaciente.findAndCount({
            order: { creadoEn: 'DESC' },
            skip: salto,
            take: limite,
        });
        return {
            exito: true,
            mensaje: 'Lista de pacientes obtenida exitosamente',
            datos: listaPacientes,
            total,
            pagina,
            limite,
            totalPaginas: Math.ceil(total / limite),
        };
    }
    async obtenerPacientePorId(id) {
        const paciente = await this.repositorioPaciente.findOne({
            where: { id },
            relations: { citas: true },
        });
        if (!paciente) {
            throw new common_1.NotFoundException(`Paciente con ID ${id} no encontrado`);
        }
        return {
            exito: true,
            mensaje: 'Paciente obtenido exitosamente',
            datos: paciente,
        };
    }
    async actualizarPaciente(id, actualizarPacienteDto) {
        const respuesta = await this.obtenerPacientePorId(id);
        const paciente = respuesta.datos;
        if (actualizarPacienteDto.numeroDocumento &&
            actualizarPacienteDto.numeroDocumento !== paciente.numeroDocumento) {
            const documentoDuplicado = await this.repositorioPaciente.findOne({
                where: { numeroDocumento: actualizarPacienteDto.numeroDocumento },
            });
            if (documentoDuplicado) {
                throw new common_1.ConflictException(`Ya existe un paciente con el documento ${actualizarPacienteDto.numeroDocumento}`);
            }
        }
        Object.assign(paciente, actualizarPacienteDto);
        const pacienteActualizado = await this.repositorioPaciente.save(paciente);
        return {
            exito: true,
            mensaje: 'Paciente actualizado exitosamente',
            datos: pacienteActualizado,
        };
    }
    async eliminarPaciente(id) {
        const respuesta = await this.obtenerPacientePorId(id);
        const paciente = respuesta.datos;
        await this.repositorioPaciente.remove(paciente);
        return {
            exito: true,
            mensaje: 'Paciente eliminado exitosamente',
        };
    }
    async obtenerMiPerfil(usuario) {
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
            throw new common_1.NotFoundException('No se encontró el documento del paciente asociado a esta sesión.');
        }
        try {
            const pacienteSap = await this.integracionHospitalService.consultarDatosDemograficos({
                tipoDocumento: tipoDocumento || 'CC',
                numeroDocumento,
                fechaNacimiento: '',
            });
            if (pacienteSap) {
                return {
                    exito: true,
                    mensaje: 'Datos demográficos obtenidos desde SAP PO',
                    datos: pacienteSap,
                };
            }
        }
        catch (e) {
            this.logger.warn(`No fue posible refrescar desde SAP PO: ${e.message}`);
        }
        const pacienteDb = await this.repositorioPaciente.findOne({
            where: [{ numeroDocumento }, { correoElectronico: usuario?.correoElectronico }],
        });
        return {
            exito: true,
            mensaje: 'Datos del paciente recuperados',
            datos: pacienteDb || usuario,
        };
    }
    async consultarPorEpisodio(episodio) {
        const pacienteSap = await this.integracionHospitalService.consultarPorEpisodio({ episodio });
        return {
            exito: true,
            mensaje: `Datos del paciente recuperados para el episodio ${episodio}`,
            datos: {
                ...pacienteSap,
                episodio,
            },
        };
    }
    async buscarPacientes(termino) {
        const resultados = await this.repositorioPaciente
            .createQueryBuilder('paciente')
            .where('paciente.nombres ILIKE :termino', { termino: `%${termino}%` })
            .orWhere('paciente.apellidos ILIKE :termino', { termino: `%${termino}%` })
            .orWhere('paciente.numeroDocumento ILIKE :termino', { termino: `%${termino}%` })
            .orWhere('paciente.correoElectronico ILIKE :termino', { termino: `%${termino}%` })
            .orderBy('paciente.apellidos', 'ASC')
            .getMany();
        return {
            exito: true,
            mensaje: `Se encontraron ${resultados.length} resultado(s)`,
            datos: resultados,
        };
    }
};
exports.PacientesService = PacientesService;
exports.PacientesService = PacientesService = PacientesService_1 = __decorate([
    (0, common_1.Injectable)({ scope: common_1.Scope.REQUEST }),
    __param(0, (0, common_1.Inject)(core_1.REQUEST)),
    __metadata("design:paramtypes", [Object, integracion_hospital_service_1.IntegracionHospitalService])
], PacientesService);
//# sourceMappingURL=pacientes.service.js.map
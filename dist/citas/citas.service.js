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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CitasService = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const cita_entity_1 = require("./entities/cita.entity");
const pacientes_service_1 = require("../pacientes/pacientes.service");
let CitasService = class CitasService {
    request;
    pacientesService;
    constructor(request, pacientesService) {
        this.request = request;
        this.pacientesService = pacientesService;
    }
    get repositorioCita() {
        return this.request.tenantConexion.getRepository(cita_entity_1.Cita);
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
    async obtenerTodasLasCitas(pagina = 1, limite = 10) {
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
        await this.pacientesService.obtenerPacientePorId(pacienteId);
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
exports.CitasService = CitasService = __decorate([
    (0, common_1.Injectable)({ scope: common_1.Scope.REQUEST }),
    __param(0, (0, common_1.Inject)(core_1.REQUEST)),
    __metadata("design:paramtypes", [Object, pacientes_service_1.PacientesService])
], CitasService);
//# sourceMappingURL=citas.service.js.map
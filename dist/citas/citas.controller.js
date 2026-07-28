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
exports.CitasController = void 0;
const common_1 = require("@nestjs/common");
const citas_service_1 = require("./citas.service");
const crear_cita_dto_1 = require("./dto/crear-cita.dto");
const actualizar_cita_dto_1 = require("./dto/actualizar-cita.dto");
const jwt_autenticacion_guard_1 = require("../common/guards/jwt-autenticacion.guard");
let CitasController = class CitasController {
    citasService;
    constructor(citasService) {
        this.citasService = citasService;
    }
    async crearCita(crearCitaDto) {
        return this.citasService.crearCita(crearCitaDto);
    }
    async obtenerTodasLasCitas(pagina, limite) {
        const numeroPagina = pagina ? parseInt(pagina, 10) : 1;
        const numeroLimite = limite ? parseInt(limite, 10) : 10;
        return this.citasService.obtenerTodasLasCitas(numeroPagina, numeroLimite);
    }
    async obtenerCitasPorPaciente(pacienteId) {
        return this.citasService.obtenerCitasPorPaciente(pacienteId);
    }
    async obtenerCitaPorId(id) {
        return this.citasService.obtenerCitaPorId(id);
    }
    async actualizarCita(id, actualizarCitaDto) {
        return this.citasService.actualizarCita(id, actualizarCitaDto);
    }
    async cancelarCita(id) {
        return this.citasService.cancelarCita(id);
    }
    async eliminarCita(id) {
        return this.citasService.eliminarCita(id);
    }
};
exports.CitasController = CitasController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [crear_cita_dto_1.CrearCitaDto]),
    __metadata("design:returntype", Promise)
], CitasController.prototype, "crearCita", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('pagina')),
    __param(1, (0, common_1.Query)('limite')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CitasController.prototype, "obtenerTodasLasCitas", null);
__decorate([
    (0, common_1.Get)('paciente/:pacienteId'),
    __param(0, (0, common_1.Param)('pacienteId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CitasController.prototype, "obtenerCitasPorPaciente", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CitasController.prototype, "obtenerCitaPorId", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, actualizar_cita_dto_1.ActualizarCitaDto]),
    __metadata("design:returntype", Promise)
], CitasController.prototype, "actualizarCita", null);
__decorate([
    (0, common_1.Patch)(':id/cancelar'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CitasController.prototype, "cancelarCita", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CitasController.prototype, "eliminarCita", null);
exports.CitasController = CitasController = __decorate([
    (0, common_1.UseGuards)(jwt_autenticacion_guard_1.GuardJwtAutenticacion),
    (0, common_1.Controller)('citas'),
    __metadata("design:paramtypes", [citas_service_1.CitasService])
], CitasController);
//# sourceMappingURL=citas.controller.js.map
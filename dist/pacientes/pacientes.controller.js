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
exports.PacientesController = void 0;
const common_1 = require("@nestjs/common");
const pacientes_service_1 = require("./pacientes.service");
const crear_paciente_dto_1 = require("./dto/crear-paciente.dto");
const actualizar_paciente_dto_1 = require("./dto/actualizar-paciente.dto");
const jwt_autenticacion_guard_1 = require("../common/guards/jwt-autenticacion.guard");
let PacientesController = class PacientesController {
    pacientesService;
    constructor(pacientesService) {
        this.pacientesService = pacientesService;
    }
    async crearPaciente(crearPacienteDto) {
        return this.pacientesService.crearPaciente(crearPacienteDto);
    }
    async obtenerTodosPacientes(pagina, limite) {
        const numeroPagina = pagina ? parseInt(pagina, 10) : 1;
        const numeroLimite = limite ? parseInt(limite, 10) : 10;
        return this.pacientesService.obtenerTodosPacientes(numeroPagina, numeroLimite);
    }
    async buscarPacientes(termino) {
        return this.pacientesService.buscarPacientes(termino);
    }
    async obtenerPacientePorId(id) {
        return this.pacientesService.obtenerPacientePorId(id);
    }
    async actualizarPaciente(id, actualizarPacienteDto) {
        return this.pacientesService.actualizarPaciente(id, actualizarPacienteDto);
    }
    async eliminarPaciente(id) {
        return this.pacientesService.eliminarPaciente(id);
    }
};
exports.PacientesController = PacientesController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [crear_paciente_dto_1.CrearPacienteDto]),
    __metadata("design:returntype", Promise)
], PacientesController.prototype, "crearPaciente", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('pagina')),
    __param(1, (0, common_1.Query)('limite')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PacientesController.prototype, "obtenerTodosPacientes", null);
__decorate([
    (0, common_1.Get)('buscar'),
    __param(0, (0, common_1.Query)('termino')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PacientesController.prototype, "buscarPacientes", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PacientesController.prototype, "obtenerPacientePorId", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, actualizar_paciente_dto_1.ActualizarPacienteDto]),
    __metadata("design:returntype", Promise)
], PacientesController.prototype, "actualizarPaciente", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PacientesController.prototype, "eliminarPaciente", null);
exports.PacientesController = PacientesController = __decorate([
    (0, common_1.UseGuards)(jwt_autenticacion_guard_1.GuardJwtAutenticacion),
    (0, common_1.Controller)('pacientes'),
    __metadata("design:paramtypes", [pacientes_service_1.PacientesService])
], PacientesController);
//# sourceMappingURL=pacientes.controller.js.map
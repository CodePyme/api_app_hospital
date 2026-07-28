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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrearCitaDto = void 0;
const class_validator_1 = require("class-validator");
const cita_entity_1 = require("../entities/cita.entity");
class CrearCitaDto {
    pacienteId;
    fechaCita;
    horaInicio;
    horaFin;
    tipoCita;
    medicoResponsable;
    especialidad;
    consultorio;
    motivoConsulta;
    observaciones;
}
exports.CrearCitaDto = CrearCitaDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'El ID del paciente es requerido' }),
    (0, class_validator_1.IsUUID)('4', { message: 'El ID del paciente debe ser un UUID válido' }),
    __metadata("design:type", String)
], CrearCitaDto.prototype, "pacienteId", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'La fecha de la cita es requerida' }),
    (0, class_validator_1.IsDateString)({}, { message: 'La fecha de la cita debe ser una fecha válida (YYYY-MM-DD)' }),
    __metadata("design:type", String)
], CrearCitaDto.prototype, "fechaCita", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'La hora de inicio es requerida' }),
    (0, class_validator_1.Matches)(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'La hora de inicio debe tener formato HH:MM' }),
    __metadata("design:type", String)
], CrearCitaDto.prototype, "horaInicio", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'La hora de fin es requerida' }),
    (0, class_validator_1.Matches)(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'La hora de fin debe tener formato HH:MM' }),
    __metadata("design:type", String)
], CrearCitaDto.prototype, "horaFin", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(cita_entity_1.TipoCita, { message: 'El tipo de cita no es válido' }),
    __metadata("design:type", String)
], CrearCitaDto.prototype, "tipoCita", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(150),
    __metadata("design:type", String)
], CrearCitaDto.prototype, "medicoResponsable", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CrearCitaDto.prototype, "especialidad", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], CrearCitaDto.prototype, "consultorio", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CrearCitaDto.prototype, "motivoConsulta", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CrearCitaDto.prototype, "observaciones", void 0);
//# sourceMappingURL=crear-cita.dto.js.map
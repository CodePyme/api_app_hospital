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
exports.CrearPacienteDto = void 0;
const class_validator_1 = require("class-validator");
const paciente_entity_1 = require("../entities/paciente.entity");
class CrearPacienteDto {
    nombres;
    apellidos;
    numeroDocumento;
    tipoDocumento;
    fechaNacimiento;
    genero;
    correoElectronico;
    telefono;
    direccion;
    ciudad;
    observaciones;
}
exports.CrearPacienteDto = CrearPacienteDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Los nombres son requeridos' }),
    (0, class_validator_1.IsString)({ message: 'Los nombres deben ser texto' }),
    (0, class_validator_1.MaxLength)(100, { message: 'Los nombres no pueden superar 100 caracteres' }),
    __metadata("design:type", String)
], CrearPacienteDto.prototype, "nombres", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Los apellidos son requeridos' }),
    (0, class_validator_1.IsString)({ message: 'Los apellidos deben ser texto' }),
    (0, class_validator_1.MaxLength)(100, { message: 'Los apellidos no pueden superar 100 caracteres' }),
    __metadata("design:type", String)
], CrearPacienteDto.prototype, "apellidos", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'El número de documento es requerido' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(20),
    __metadata("design:type", String)
], CrearPacienteDto.prototype, "numeroDocumento", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(30),
    __metadata("design:type", String)
], CrearPacienteDto.prototype, "tipoDocumento", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'La fecha de nacimiento es requerida' }),
    (0, class_validator_1.IsDateString)({}, { message: 'La fecha de nacimiento debe ser una fecha válida (YYYY-MM-DD)' }),
    __metadata("design:type", String)
], CrearPacienteDto.prototype, "fechaNacimiento", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(paciente_entity_1.GeneroPaciente, { message: 'El género debe ser: masculino, femenino u otro' }),
    __metadata("design:type", String)
], CrearPacienteDto.prototype, "genero", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)({}, { message: 'El correo electrónico no es válido' }),
    (0, class_validator_1.MaxLength)(150),
    __metadata("design:type", String)
], CrearPacienteDto.prototype, "correoElectronico", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(20),
    __metadata("design:type", String)
], CrearPacienteDto.prototype, "telefono", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CrearPacienteDto.prototype, "direccion", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CrearPacienteDto.prototype, "ciudad", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CrearPacienteDto.prototype, "observaciones", void 0);
//# sourceMappingURL=crear-paciente.dto.js.map
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
exports.Paciente = exports.EstadoPaciente = exports.GeneroPaciente = void 0;
const typeorm_1 = require("typeorm");
const cita_entity_1 = require("../../citas/entities/cita.entity");
var GeneroPaciente;
(function (GeneroPaciente) {
    GeneroPaciente["MASCULINO"] = "masculino";
    GeneroPaciente["FEMENINO"] = "femenino";
    GeneroPaciente["OTRO"] = "otro";
})(GeneroPaciente || (exports.GeneroPaciente = GeneroPaciente = {}));
var EstadoPaciente;
(function (EstadoPaciente) {
    EstadoPaciente["ACTIVO"] = "activo";
    EstadoPaciente["INACTIVO"] = "inactivo";
})(EstadoPaciente || (exports.EstadoPaciente = EstadoPaciente = {}));
let Paciente = class Paciente {
    id;
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
    estado;
    observaciones;
    creadoEn;
    actualizadoEn;
    citas;
};
exports.Paciente = Paciente;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Paciente.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'nombres', type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], Paciente.prototype, "nombres", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'apellidos', type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], Paciente.prototype, "apellidos", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'numero_documento', type: 'varchar', length: 20, unique: true }),
    __metadata("design:type", String)
], Paciente.prototype, "numeroDocumento", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'tipo_documento', type: 'varchar', length: 30, default: 'cedula' }),
    __metadata("design:type", String)
], Paciente.prototype, "tipoDocumento", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'fecha_nacimiento', type: 'date' }),
    __metadata("design:type", Date)
], Paciente.prototype, "fechaNacimiento", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'genero', type: 'enum', enum: GeneroPaciente, default: GeneroPaciente.OTRO }),
    __metadata("design:type", String)
], Paciente.prototype, "genero", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'correo_electronico', type: 'varchar', length: 150, unique: true, nullable: true }),
    __metadata("design:type", String)
], Paciente.prototype, "correoElectronico", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'telefono', type: 'varchar', length: 20, nullable: true }),
    __metadata("design:type", String)
], Paciente.prototype, "telefono", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'direccion', type: 'text', nullable: true }),
    __metadata("design:type", String)
], Paciente.prototype, "direccion", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ciudad', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], Paciente.prototype, "ciudad", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'estado', type: 'enum', enum: EstadoPaciente, default: EstadoPaciente.ACTIVO }),
    __metadata("design:type", String)
], Paciente.prototype, "estado", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'observaciones', type: 'text', nullable: true }),
    __metadata("design:type", String)
], Paciente.prototype, "observaciones", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'creado_en' }),
    __metadata("design:type", Date)
], Paciente.prototype, "creadoEn", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'actualizado_en' }),
    __metadata("design:type", Date)
], Paciente.prototype, "actualizadoEn", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => cita_entity_1.Cita, (cita) => cita.paciente),
    __metadata("design:type", Array)
], Paciente.prototype, "citas", void 0);
exports.Paciente = Paciente = __decorate([
    (0, typeorm_1.Entity)({ name: 'pacientes' })
], Paciente);
//# sourceMappingURL=paciente.entity.js.map
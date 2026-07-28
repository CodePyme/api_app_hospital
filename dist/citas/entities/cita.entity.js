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
exports.Cita = exports.TipoCita = exports.EstadoCita = void 0;
const typeorm_1 = require("typeorm");
const paciente_entity_1 = require("../../pacientes/entities/paciente.entity");
var EstadoCita;
(function (EstadoCita) {
    EstadoCita["PROGRAMADA"] = "programada";
    EstadoCita["CONFIRMADA"] = "confirmada";
    EstadoCita["EN_ATENCION"] = "en_atencion";
    EstadoCita["COMPLETADA"] = "completada";
    EstadoCita["CANCELADA"] = "cancelada";
    EstadoCita["NO_ASISTIO"] = "no_asistio";
})(EstadoCita || (exports.EstadoCita = EstadoCita = {}));
var TipoCita;
(function (TipoCita) {
    TipoCita["CONSULTA_GENERAL"] = "consulta_general";
    TipoCita["ESPECIALISTA"] = "especialista";
    TipoCita["URGENCIAS"] = "urgencias";
    TipoCita["CONTROL"] = "control";
    TipoCita["PROCEDIMIENTO"] = "procedimiento";
})(TipoCita || (exports.TipoCita = TipoCita = {}));
let Cita = class Cita {
    id;
    pacienteId;
    paciente;
    fechaCita;
    horaInicio;
    horaFin;
    tipoCita;
    estado;
    medicoResponsable;
    especialidad;
    consultorio;
    motivoConsulta;
    observaciones;
    creadoEn;
    actualizadoEn;
};
exports.Cita = Cita;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Cita.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'paciente_id', type: 'uuid' }),
    __metadata("design:type", String)
], Cita.prototype, "pacienteId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => paciente_entity_1.Paciente, (paciente) => paciente.citas, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'paciente_id' }),
    __metadata("design:type", paciente_entity_1.Paciente)
], Cita.prototype, "paciente", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'fecha_cita', type: 'date' }),
    __metadata("design:type", Date)
], Cita.prototype, "fechaCita", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'hora_inicio', type: 'time' }),
    __metadata("design:type", String)
], Cita.prototype, "horaInicio", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'hora_fin', type: 'time' }),
    __metadata("design:type", String)
], Cita.prototype, "horaFin", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'tipo_cita', type: 'enum', enum: TipoCita, default: TipoCita.CONSULTA_GENERAL }),
    __metadata("design:type", String)
], Cita.prototype, "tipoCita", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'estado', type: 'enum', enum: EstadoCita, default: EstadoCita.PROGRAMADA }),
    __metadata("design:type", String)
], Cita.prototype, "estado", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'medico_responsable', type: 'varchar', length: 150, nullable: true }),
    __metadata("design:type", String)
], Cita.prototype, "medicoResponsable", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'especialidad', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], Cita.prototype, "especialidad", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'consultorio', type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], Cita.prototype, "consultorio", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'motivo_consulta', type: 'text', nullable: true }),
    __metadata("design:type", String)
], Cita.prototype, "motivoConsulta", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'observaciones', type: 'text', nullable: true }),
    __metadata("design:type", String)
], Cita.prototype, "observaciones", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'creado_en' }),
    __metadata("design:type", Date)
], Cita.prototype, "creadoEn", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'actualizado_en' }),
    __metadata("design:type", Date)
], Cita.prototype, "actualizadoEn", void 0);
exports.Cita = Cita = __decorate([
    (0, typeorm_1.Entity)({ name: 'citas' })
], Cita);
//# sourceMappingURL=cita.entity.js.map
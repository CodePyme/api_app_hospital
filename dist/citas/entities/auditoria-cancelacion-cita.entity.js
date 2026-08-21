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
exports.AuditoriaCancelacionCita = void 0;
const typeorm_1 = require("typeorm");
let AuditoriaCancelacionCita = class AuditoriaCancelacionCita {
    id;
    idCita;
    pacienteId;
    usuarioId;
    numeroDocumento;
    tipoDocumento;
    nombrePaciente;
    idMotivo;
    descripcionMotivo;
    observaciones;
    limiteHoras;
    codigoRespuestaSap;
    mensajeRespuestaSap;
    exitosa;
    ipUsuario;
    userAgent;
    datosCita;
    creadoEn;
};
exports.AuditoriaCancelacionCita = AuditoriaCancelacionCita;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], AuditoriaCancelacionCita.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'id_cita', type: 'varchar', length: 30 }),
    __metadata("design:type", String)
], AuditoriaCancelacionCita.prototype, "idCita", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'paciente_id', type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], AuditoriaCancelacionCita.prototype, "pacienteId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'usuario_id', type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], AuditoriaCancelacionCita.prototype, "usuarioId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'numero_documento', type: 'varchar', length: 30 }),
    __metadata("design:type", String)
], AuditoriaCancelacionCita.prototype, "numeroDocumento", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'tipo_documento', type: 'varchar', length: 30, default: 'CC' }),
    __metadata("design:type", String)
], AuditoriaCancelacionCita.prototype, "tipoDocumento", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'nombre_paciente', type: 'varchar', length: 150, nullable: true }),
    __metadata("design:type", String)
], AuditoriaCancelacionCita.prototype, "nombrePaciente", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'id_motivo', type: 'varchar', length: 10 }),
    __metadata("design:type", String)
], AuditoriaCancelacionCita.prototype, "idMotivo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'descripcion_motivo', type: 'varchar', length: 150 }),
    __metadata("design:type", String)
], AuditoriaCancelacionCita.prototype, "descripcionMotivo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'observaciones', type: 'text', nullable: true }),
    __metadata("design:type", String)
], AuditoriaCancelacionCita.prototype, "observaciones", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'limite_horas', type: 'int', default: 24 }),
    __metadata("design:type", Number)
], AuditoriaCancelacionCita.prototype, "limiteHoras", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'codigo_respuesta_sap', type: 'varchar', length: 10, nullable: true }),
    __metadata("design:type", String)
], AuditoriaCancelacionCita.prototype, "codigoRespuestaSap", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'mensaje_respuesta_sap', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], AuditoriaCancelacionCita.prototype, "mensajeRespuestaSap", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'exitosa', type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], AuditoriaCancelacionCita.prototype, "exitosa", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ip_usuario', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], AuditoriaCancelacionCita.prototype, "ipUsuario", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_agent', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], AuditoriaCancelacionCita.prototype, "userAgent", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'datos_cita', type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], AuditoriaCancelacionCita.prototype, "datosCita", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'creado_en', type: 'timestamp with time zone' }),
    __metadata("design:type", Date)
], AuditoriaCancelacionCita.prototype, "creadoEn", void 0);
exports.AuditoriaCancelacionCita = AuditoriaCancelacionCita = __decorate([
    (0, typeorm_1.Entity)({ name: 'auditoria_cancelaciones_citas' })
], AuditoriaCancelacionCita);
//# sourceMappingURL=auditoria-cancelacion-cita.entity.js.map
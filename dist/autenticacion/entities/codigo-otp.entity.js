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
exports.CodigoOtp = void 0;
const typeorm_1 = require("typeorm");
let CodigoOtp = class CodigoOtp {
    id;
    tipoDocumento;
    numeroDocumento;
    codigo;
    correo;
    telefono;
    datosPaciente;
    intentos;
    maxIntentos;
    expiraEn;
    usado;
    creadoEn;
    actualizadoEn;
};
exports.CodigoOtp = CodigoOtp;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], CodigoOtp.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ name: 'tipo_documento', type: 'varchar', length: 30 }),
    __metadata("design:type", String)
], CodigoOtp.prototype, "tipoDocumento", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ name: 'numero_documento', type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], CodigoOtp.prototype, "numeroDocumento", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'codigo', type: 'varchar', length: 10 }),
    __metadata("design:type", String)
], CodigoOtp.prototype, "codigo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'correo', type: 'varchar', length: 150 }),
    __metadata("design:type", String)
], CodigoOtp.prototype, "correo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'telefono', type: 'varchar', length: 30, nullable: true }),
    __metadata("design:type", Object)
], CodigoOtp.prototype, "telefono", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'datos_paciente', type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], CodigoOtp.prototype, "datosPaciente", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'intentos', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], CodigoOtp.prototype, "intentos", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'max_intentos', type: 'int', default: 3 }),
    __metadata("design:type", Number)
], CodigoOtp.prototype, "maxIntentos", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'expira_en', type: 'timestamp with time zone' }),
    __metadata("design:type", Date)
], CodigoOtp.prototype, "expiraEn", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'usado', type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], CodigoOtp.prototype, "usado", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'creado_en' }),
    __metadata("design:type", Date)
], CodigoOtp.prototype, "creadoEn", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'actualizado_en' }),
    __metadata("design:type", Date)
], CodigoOtp.prototype, "actualizadoEn", void 0);
exports.CodigoOtp = CodigoOtp = __decorate([
    (0, typeorm_1.Entity)({ name: 'codigos_otp' })
], CodigoOtp);
//# sourceMappingURL=codigo-otp.entity.js.map
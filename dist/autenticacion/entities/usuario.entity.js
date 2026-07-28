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
exports.Usuario = exports.RolUsuario = void 0;
const typeorm_1 = require("typeorm");
var RolUsuario;
(function (RolUsuario) {
    RolUsuario["ADMINISTRADOR"] = "administrador";
    RolUsuario["MEDICO"] = "medico";
    RolUsuario["RECEPCIONISTA"] = "recepcionista";
    RolUsuario["PACIENTE"] = "paciente";
})(RolUsuario || (exports.RolUsuario = RolUsuario = {}));
let Usuario = class Usuario {
    id;
    nombres;
    apellidos;
    correoElectronico;
    contrasena;
    rol;
    activo;
    creadoEn;
    actualizadoEn;
};
exports.Usuario = Usuario;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Usuario.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'nombres', type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], Usuario.prototype, "nombres", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'apellidos', type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], Usuario.prototype, "apellidos", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'correo_electronico', type: 'varchar', length: 150, unique: true }),
    __metadata("design:type", String)
], Usuario.prototype, "correoElectronico", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'contrasena', type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Usuario.prototype, "contrasena", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'rol', type: 'enum', enum: RolUsuario, default: RolUsuario.RECEPCIONISTA }),
    __metadata("design:type", String)
], Usuario.prototype, "rol", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'activo', type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], Usuario.prototype, "activo", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'creado_en' }),
    __metadata("design:type", Date)
], Usuario.prototype, "creadoEn", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'actualizado_en' }),
    __metadata("design:type", Date)
], Usuario.prototype, "actualizadoEn", void 0);
exports.Usuario = Usuario = __decorate([
    (0, typeorm_1.Entity)({ name: 'usuarios' })
], Usuario);
//# sourceMappingURL=usuario.entity.js.map
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
exports.Permiso = void 0;
const typeorm_1 = require("typeorm");
const rol_entity_1 = require("../../roles/entities/rol.entity");
const usuario_entity_1 = require("../../autenticacion/entities/usuario.entity");
let Permiso = class Permiso {
    id;
    codigo;
    nombre;
    descripcion;
    modulo;
    activo;
    roles;
    usuarios;
    creadoEn;
    actualizadoEn;
};
exports.Permiso = Permiso;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Permiso.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'codigo', type: 'varchar', length: 100, unique: true }),
    __metadata("design:type", String)
], Permiso.prototype, "codigo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'nombre', type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], Permiso.prototype, "nombre", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'descripcion', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], Permiso.prototype, "descripcion", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'modulo', type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], Permiso.prototype, "modulo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'activo', type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], Permiso.prototype, "activo", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => rol_entity_1.Rol, (rol) => rol.permisos),
    __metadata("design:type", Array)
], Permiso.prototype, "roles", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => usuario_entity_1.Usuario, (usuario) => usuario.permisosDirectos),
    __metadata("design:type", Array)
], Permiso.prototype, "usuarios", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'creado_en' }),
    __metadata("design:type", Date)
], Permiso.prototype, "creadoEn", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'actualizado_en' }),
    __metadata("design:type", Date)
], Permiso.prototype, "actualizadoEn", void 0);
exports.Permiso = Permiso = __decorate([
    (0, typeorm_1.Entity)({ name: 'permisos' })
], Permiso);
//# sourceMappingURL=permiso.entity.js.map
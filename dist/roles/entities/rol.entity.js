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
exports.Rol = void 0;
const typeorm_1 = require("typeorm");
const permiso_entity_1 = require("../../permisos/entities/permiso.entity");
const usuario_entity_1 = require("../../autenticacion/entities/usuario.entity");
let Rol = class Rol {
    id;
    codigo;
    nombre;
    descripcion;
    esSistema;
    activo;
    permisos;
    usuarios;
    creadoEn;
    actualizadoEn;
};
exports.Rol = Rol;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Rol.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'codigo', type: 'varchar', length: 50, unique: true }),
    __metadata("design:type", String)
], Rol.prototype, "codigo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'nombre', type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], Rol.prototype, "nombre", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'descripcion', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], Rol.prototype, "descripcion", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'es_sistema', type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Rol.prototype, "esSistema", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'activo', type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], Rol.prototype, "activo", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => permiso_entity_1.Permiso, (permiso) => permiso.roles, { cascade: false }),
    (0, typeorm_1.JoinTable)({
        name: 'roles_permisos',
        joinColumn: { name: 'rol_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'permiso_id', referencedColumnName: 'id' },
    }),
    __metadata("design:type", Array)
], Rol.prototype, "permisos", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => usuario_entity_1.Usuario, (usuario) => usuario.rolEntidad),
    __metadata("design:type", Array)
], Rol.prototype, "usuarios", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'creado_en' }),
    __metadata("design:type", Date)
], Rol.prototype, "creadoEn", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'actualizado_en' }),
    __metadata("design:type", Date)
], Rol.prototype, "actualizadoEn", void 0);
exports.Rol = Rol = __decorate([
    (0, typeorm_1.Entity)({ name: 'roles' })
], Rol);
//# sourceMappingURL=rol.entity.js.map
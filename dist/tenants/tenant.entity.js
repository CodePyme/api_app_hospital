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
exports.Tenant = void 0;
const typeorm_1 = require("typeorm");
let Tenant = class Tenant {
    id;
    nombre;
    dominio;
    slug;
    dbHost;
    dbPort;
    dbUsername;
    dbPassword;
    dbDatabase;
    activo;
    nombreEntidad;
    logoUrl;
    colorPrimario;
    colorSecundario;
    creadoEn;
    actualizadoEn;
};
exports.Tenant = Tenant;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Tenant.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'nombre', type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], Tenant.prototype, "nombre", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'dominio', type: 'varchar', length: 255, unique: true }),
    __metadata("design:type", String)
], Tenant.prototype, "dominio", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'slug', type: 'varchar', length: 100, unique: true }),
    __metadata("design:type", String)
], Tenant.prototype, "slug", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'db_host', type: 'varchar', length: 255, default: '127.0.0.1' }),
    __metadata("design:type", String)
], Tenant.prototype, "dbHost", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'db_port', type: 'int', default: 5432 }),
    __metadata("design:type", Number)
], Tenant.prototype, "dbPort", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'db_username', type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], Tenant.prototype, "dbUsername", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'db_password', type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Tenant.prototype, "dbPassword", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'db_database', type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], Tenant.prototype, "dbDatabase", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'activo', type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], Tenant.prototype, "activo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'nombre_entidad', type: 'varchar', length: 150, default: 'Salud Plus' }),
    __metadata("design:type", String)
], Tenant.prototype, "nombreEntidad", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'logo_url', type: 'varchar', length: 500, nullable: true }),
    __metadata("design:type", String)
], Tenant.prototype, "logoUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'color_primario', type: 'varchar', length: 20, default: '#075c39' }),
    __metadata("design:type", String)
], Tenant.prototype, "colorPrimario", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'color_secundario', type: 'varchar', length: 20, default: '#9cc516' }),
    __metadata("design:type", String)
], Tenant.prototype, "colorSecundario", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'creado_en' }),
    __metadata("design:type", Date)
], Tenant.prototype, "creadoEn", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'actualizado_en' }),
    __metadata("design:type", Date)
], Tenant.prototype, "actualizadoEn", void 0);
exports.Tenant = Tenant = __decorate([
    (0, typeorm_1.Entity)({ name: 'tenants' })
], Tenant);
//# sourceMappingURL=tenant.entity.js.map
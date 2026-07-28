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
exports.CrearTenantDto = void 0;
const class_validator_1 = require("class-validator");
class CrearTenantDto {
    nombre;
    dominio;
    slug;
    dbHost;
    dbPort;
    dbUsername;
    dbPassword;
    dbDatabase;
    activo;
}
exports.CrearTenantDto = CrearTenantDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'El nombre es requerido' }),
    (0, class_validator_1.Length)(2, 100, { message: 'El nombre debe tener entre 2 y 100 caracteres' }),
    __metadata("design:type", String)
], CrearTenantDto.prototype, "nombre", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'El dominio es requerido' }),
    (0, class_validator_1.Length)(3, 255, { message: 'El dominio debe tener entre 3 y 255 caracteres' }),
    (0, class_validator_1.Matches)(/^[a-z0-9][a-z0-9\-\.]*[a-z0-9]$|^localhost$/, {
        message: 'El dominio debe ser válido (ej: clinica-abc.com o localhost)',
    }),
    __metadata("design:type", String)
], CrearTenantDto.prototype, "dominio", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'El slug es requerido' }),
    (0, class_validator_1.Length)(2, 100),
    (0, class_validator_1.Matches)(/^[a-z0-9\-]+$/, {
        message: 'El slug solo puede contener letras minúsculas, números y guiones',
    }),
    __metadata("design:type", String)
], CrearTenantDto.prototype, "slug", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'El host de la BD es requerido' }),
    __metadata("design:type", String)
], CrearTenantDto.prototype, "dbHost", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(65535),
    __metadata("design:type", Number)
], CrearTenantDto.prototype, "dbPort", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'El usuario de la BD es requerido' }),
    __metadata("design:type", String)
], CrearTenantDto.prototype, "dbUsername", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'La contraseña de la BD es requerida' }),
    __metadata("design:type", String)
], CrearTenantDto.prototype, "dbPassword", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'El nombre de la BD es requerido' }),
    (0, class_validator_1.Matches)(/^[a-z0-9_]+$/, {
        message: 'El nombre de la BD solo puede contener letras minúsculas, números y guiones bajos',
    }),
    __metadata("design:type", String)
], CrearTenantDto.prototype, "dbDatabase", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CrearTenantDto.prototype, "activo", void 0);
//# sourceMappingURL=crear-tenant.dto.js.map
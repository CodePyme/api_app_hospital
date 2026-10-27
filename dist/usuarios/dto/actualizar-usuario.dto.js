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
exports.ActualizarUsuarioDto = void 0;
const class_validator_1 = require("class-validator");
class ActualizarUsuarioDto {
    nombres;
    apellidos;
    correoElectronico;
    contrasena;
    rolId;
    permisoIds;
    activo;
}
exports.ActualizarUsuarioDto = ActualizarUsuarioDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ActualizarUsuarioDto.prototype, "nombres", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ActualizarUsuarioDto.prototype, "apellidos", void 0);
__decorate([
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ActualizarUsuarioDto.prototype, "correoElectronico", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MinLength)(6, { message: 'La contraseña debe tener al menos 6 caracteres' }),
    __metadata("design:type", String)
], ActualizarUsuarioDto.prototype, "contrasena", void 0);
__decorate([
    (0, class_validator_1.IsUUID)('4', { message: 'El rol seleccionado no es válido' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ActualizarUsuarioDto.prototype, "rolId", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsUUID)('4', { each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], ActualizarUsuarioDto.prototype, "permisoIds", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], ActualizarUsuarioDto.prototype, "activo", void 0);
//# sourceMappingURL=actualizar-usuario.dto.js.map
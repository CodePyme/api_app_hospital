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
exports.RegistrarUsuarioDto = void 0;
const class_validator_1 = require("class-validator");
const usuario_entity_1 = require("../entities/usuario.entity");
class RegistrarUsuarioDto {
    nombres;
    apellidos;
    correoElectronico;
    contrasena;
    rol;
}
exports.RegistrarUsuarioDto = RegistrarUsuarioDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Los nombres son requeridos' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], RegistrarUsuarioDto.prototype, "nombres", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Los apellidos son requeridos' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], RegistrarUsuarioDto.prototype, "apellidos", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'El correo electrónico es requerido' }),
    (0, class_validator_1.IsEmail)({}, { message: 'El correo electrónico no es válido' }),
    (0, class_validator_1.MaxLength)(150),
    __metadata("design:type", String)
], RegistrarUsuarioDto.prototype, "correoElectronico", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'La contraseña es requerida' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(8, { message: 'La contraseña debe tener al menos 8 caracteres' }),
    __metadata("design:type", String)
], RegistrarUsuarioDto.prototype, "contrasena", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(usuario_entity_1.RolUsuario, { message: 'El rol del usuario no es válido' }),
    __metadata("design:type", String)
], RegistrarUsuarioDto.prototype, "rol", void 0);
//# sourceMappingURL=registrar-usuario.dto.js.map
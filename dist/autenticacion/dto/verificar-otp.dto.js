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
exports.VerificarOtpDto = void 0;
const class_validator_1 = require("class-validator");
class VerificarOtpDto {
    tipoDocumento;
    numeroDocumento;
    codigoOtp;
}
exports.VerificarOtpDto = VerificarOtpDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'El tipo de documento es requerido' }),
    (0, class_validator_1.IsString)({ message: 'El tipo de documento debe ser una cadena de texto' }),
    __metadata("design:type", String)
], VerificarOtpDto.prototype, "tipoDocumento", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'El número de documento es requerido' }),
    (0, class_validator_1.IsString)({ message: 'El número de documento debe ser una cadena de texto' }),
    __metadata("design:type", String)
], VerificarOtpDto.prototype, "numeroDocumento", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'El código OTP es requerido' }),
    (0, class_validator_1.IsString)({ message: 'El código OTP debe ser numérico' }),
    (0, class_validator_1.Length)(4, 4, { message: 'El código debe tener exactamente 4 dígitos' }),
    (0, class_validator_1.Matches)(/^[0-9]{4}$/, { message: 'El código debe contener solo números' }),
    __metadata("design:type", String)
], VerificarOtpDto.prototype, "codigoOtp", void 0);
//# sourceMappingURL=verificar-otp.dto.js.map
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
exports.ActualizarCitaDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const crear_cita_dto_1 = require("./crear-cita.dto");
const class_validator_1 = require("class-validator");
const cita_entity_1 = require("../entities/cita.entity");
class ActualizarCitaDto extends (0, mapped_types_1.PartialType)(crear_cita_dto_1.CrearCitaDto) {
    estado;
}
exports.ActualizarCitaDto = ActualizarCitaDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(cita_entity_1.EstadoCita, { message: 'El estado de la cita no es válido' }),
    __metadata("design:type", String)
], ActualizarCitaDto.prototype, "estado", void 0);
//# sourceMappingURL=actualizar-cita.dto.js.map
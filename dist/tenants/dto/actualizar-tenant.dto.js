"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActualizarTenantDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const crear_tenant_dto_1 = require("./crear-tenant.dto");
class ActualizarTenantDto extends (0, mapped_types_1.PartialType)(crear_tenant_dto_1.CrearTenantDto) {
}
exports.ActualizarTenantDto = ActualizarTenantDto;
//# sourceMappingURL=actualizar-tenant.dto.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequierePermisos = exports.PERMISOS_KEY = void 0;
const common_1 = require("@nestjs/common");
exports.PERMISOS_KEY = 'permisos';
const RequierePermisos = (...permisos) => (0, common_1.SetMetadata)(exports.PERMISOS_KEY, permisos);
exports.RequierePermisos = RequierePermisos;
//# sourceMappingURL=permisos.decorator.js.map
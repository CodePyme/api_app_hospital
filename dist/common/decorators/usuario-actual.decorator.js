"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsuarioActual = void 0;
const common_1 = require("@nestjs/common");
exports.UsuarioActual = (0, common_1.createParamDecorator)((dato, contexto) => {
    const solicitud = contexto.switchToHttp().getRequest();
    const usuario = solicitud.user;
    return dato ? usuario?.[dato] : usuario;
});
//# sourceMappingURL=usuario-actual.decorator.js.map
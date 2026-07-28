"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuperAdminGuard = void 0;
const common_1 = require("@nestjs/common");
let SuperAdminGuard = class SuperAdminGuard {
    CORREO_SUPER_ADMIN = 'admin@codepyme.com';
    canActivate(context) {
        const solicitud = context.switchToHttp().getRequest();
        const usuario = solicitud.user;
        if (!usuario) {
            throw new common_1.ForbiddenException('Acceso denegado: se requiere autenticación');
        }
        if (usuario.correoElectronico !== this.CORREO_SUPER_ADMIN) {
            throw new common_1.ForbiddenException('Acceso denegado: solo el super administrador puede gestionar los tenants');
        }
        return true;
    }
};
exports.SuperAdminGuard = SuperAdminGuard;
exports.SuperAdminGuard = SuperAdminGuard = __decorate([
    (0, common_1.Injectable)()
], SuperAdminGuard);
//# sourceMappingURL=super-admin.guard.js.map
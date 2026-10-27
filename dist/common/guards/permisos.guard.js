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
exports.PermisosGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const permisos_decorator_1 = require("../decorators/permisos.decorator");
const usuario_entity_1 = require("../../autenticacion/entities/usuario.entity");
let PermisosGuard = class PermisosGuard {
    reflector;
    CORREO_SUPER_ADMIN = 'admin@codepyme.com';
    constructor(reflector) {
        this.reflector = reflector;
    }
    canActivate(context) {
        const permisosRequeridos = this.reflector.getAllAndOverride(permisos_decorator_1.PERMISOS_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!permisosRequeridos || permisosRequeridos.length === 0) {
            return true;
        }
        const { user } = context.switchToHttp().getRequest();
        if (!user) {
            throw new common_1.ForbiddenException('No tienes permisos para acceder a este recurso.');
        }
        if (user.correoElectronico === this.CORREO_SUPER_ADMIN) {
            return true;
        }
        const permisosUsuario = Array.isArray(user.permisos) ? user.permisos : [];
        if (permisosUsuario.includes('*')) {
            return true;
        }
        const tienePermiso = permisosRequeridos.some((p) => permisosUsuario.includes(p));
        if (!tienePermiso) {
            if (user.rol === usuario_entity_1.RolUsuario.ADMINISTRADOR) {
                return true;
            }
            throw new common_1.ForbiddenException(`Permiso denegado. Se requiere alguno de los siguientes permisos: ${permisosRequeridos.join(', ')}`);
        }
        return true;
    }
};
exports.PermisosGuard = PermisosGuard;
exports.PermisosGuard = PermisosGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector])
], PermisosGuard);
//# sourceMappingURL=permisos.guard.js.map
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
exports.EstrategiaJwt = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const config_1 = require("@nestjs/config");
const passport_jwt_1 = require("passport-jwt");
const usuario_entity_1 = require("../entities/usuario.entity");
const permisos_utils_1 = require("../../permisos/permisos.utils");
let EstrategiaJwt = class EstrategiaJwt extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy) {
    constructor(configService) {
        const secreto = configService.get('JWT_SECRETO');
        if (!secreto) {
            throw new Error('JWT_SECRETO no está configurado. Defina esta variable de entorno antes de iniciar la aplicación.');
        }
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: secreto,
            passReqToCallback: true,
        });
    }
    async validate(req, cargaJwt) {
        if (!req.tenantConexion) {
            throw new common_1.UnauthorizedException('Tenant no configurado para la petición');
        }
        const repositorioUsuario = req.tenantConexion.getRepository(usuario_entity_1.Usuario);
        const usuario = await repositorioUsuario.findOne({
            where: { id: cargaJwt.sub, activo: true },
            relations: { rolEntidad: { permisos: true }, permisosDirectos: true },
        });
        if (!usuario) {
            throw new common_1.UnauthorizedException('Token inválido o usuario no encontrado');
        }
        const permisos = (0, permisos_utils_1.calcularPermisosConsolidados)(usuario);
        return {
            ...usuario,
            permisos,
            pacienteId: cargaJwt.pacienteId,
            tipoDocumento: cargaJwt.tipoDocumento,
            numeroDocumento: cargaJwt.numeroDocumento,
        };
    }
};
exports.EstrategiaJwt = EstrategiaJwt;
exports.EstrategiaJwt = EstrategiaJwt = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], EstrategiaJwt);
//# sourceMappingURL=jwt.strategy.js.map
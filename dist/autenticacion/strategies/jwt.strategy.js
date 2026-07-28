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
const passport_jwt_1 = require("passport-jwt");
const usuario_entity_1 = require("../entities/usuario.entity");
let EstrategiaJwt = class EstrategiaJwt extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy) {
    constructor() {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRETO || 'secreto_por_defecto',
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
        });
        if (!usuario) {
            throw new common_1.UnauthorizedException('Token inválido o usuario no encontrado');
        }
        return usuario;
    }
};
exports.EstrategiaJwt = EstrategiaJwt;
exports.EstrategiaJwt = EstrategiaJwt = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], EstrategiaJwt);
//# sourceMappingURL=jwt.strategy.js.map
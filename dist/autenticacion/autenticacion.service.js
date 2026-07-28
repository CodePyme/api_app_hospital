"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutenticacionService = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcrypt"));
const usuario_entity_1 = require("./entities/usuario.entity");
let AutenticacionService = class AutenticacionService {
    request;
    servicioJwt;
    RONDAS_HASH = 10;
    constructor(request, servicioJwt) {
        this.request = request;
        this.servicioJwt = servicioJwt;
    }
    get repositorioUsuario() {
        return this.request.tenantConexion.getRepository(usuario_entity_1.Usuario);
    }
    async registrarUsuario(registrarUsuarioDto) {
        const usuarioExistente = await this.repositorioUsuario.findOne({
            where: { correoElectronico: registrarUsuarioDto.correoElectronico },
        });
        if (usuarioExistente) {
            throw new common_1.ConflictException(`Ya existe un usuario con el correo ${registrarUsuarioDto.correoElectronico}`);
        }
        const contrasenaHasheada = await bcrypt.hash(registrarUsuarioDto.contrasena, this.RONDAS_HASH);
        const nuevoUsuario = this.repositorioUsuario.create({
            ...registrarUsuarioDto,
            contrasena: contrasenaHasheada,
        });
        const usuarioGuardado = await this.repositorioUsuario.save(nuevoUsuario);
        const { contrasena: _contrasena, ...usuarioSinContrasena } = usuarioGuardado;
        return {
            exito: true,
            mensaje: 'Usuario registrado exitosamente',
            datos: usuarioSinContrasena,
        };
    }
    async iniciarSesion(iniciarSesionDto) {
        const usuario = await this.repositorioUsuario.findOne({
            where: { correoElectronico: iniciarSesionDto.correoElectronico, activo: true },
        });
        if (!usuario) {
            throw new common_1.UnauthorizedException('Credenciales incorrectas');
        }
        const contrasenaValida = await bcrypt.compare(iniciarSesionDto.contrasena, usuario.contrasena);
        if (!contrasenaValida) {
            throw new common_1.UnauthorizedException('Credenciales incorrectas');
        }
        const cargaJwt = {
            sub: usuario.id,
            correoElectronico: usuario.correoElectronico,
            rol: usuario.rol,
        };
        const token = await this.servicioJwt.signAsync(cargaJwt);
        const { contrasena: _contrasena, ...usuarioSinContrasena } = usuario;
        return {
            exito: true,
            mensaje: 'Sesión iniciada exitosamente',
            datos: {
                token,
                usuario: usuarioSinContrasena,
            },
        };
    }
    async obtenerPerfilUsuario(usuario) {
        const { contrasena: _contrasena, ...perfilUsuario } = usuario;
        return {
            exito: true,
            mensaje: 'Perfil del usuario obtenido exitosamente',
            datos: perfilUsuario,
        };
    }
};
exports.AutenticacionService = AutenticacionService;
exports.AutenticacionService = AutenticacionService = __decorate([
    (0, common_1.Injectable)({ scope: common_1.Scope.REQUEST }),
    __param(0, (0, common_1.Inject)(core_1.REQUEST)),
    __metadata("design:paramtypes", [Object, jwt_1.JwtService])
], AutenticacionService);
//# sourceMappingURL=autenticacion.service.js.map
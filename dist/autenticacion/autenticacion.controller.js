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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutenticacionController = void 0;
const common_1 = require("@nestjs/common");
const autenticacion_service_1 = require("./autenticacion.service");
const iniciar_sesion_dto_1 = require("./dto/iniciar-sesion.dto");
const registrar_usuario_dto_1 = require("./dto/registrar-usuario.dto");
const jwt_autenticacion_guard_1 = require("../common/guards/jwt-autenticacion.guard");
const usuario_actual_decorator_1 = require("../common/decorators/usuario-actual.decorator");
const usuario_entity_1 = require("./entities/usuario.entity");
let AutenticacionController = class AutenticacionController {
    autenticacionService;
    constructor(autenticacionService) {
        this.autenticacionService = autenticacionService;
    }
    async registrarUsuario(registrarUsuarioDto) {
        return this.autenticacionService.registrarUsuario(registrarUsuarioDto);
    }
    async iniciarSesion(iniciarSesionDto) {
        return this.autenticacionService.iniciarSesion(iniciarSesionDto);
    }
    async obtenerPerfil(usuario) {
        return this.autenticacionService.obtenerPerfilUsuario(usuario);
    }
};
exports.AutenticacionController = AutenticacionController;
__decorate([
    (0, common_1.Post)('registrar'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [registrar_usuario_dto_1.RegistrarUsuarioDto]),
    __metadata("design:returntype", Promise)
], AutenticacionController.prototype, "registrarUsuario", null);
__decorate([
    (0, common_1.Post)('iniciar-sesion'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [iniciar_sesion_dto_1.IniciarSesionDto]),
    __metadata("design:returntype", Promise)
], AutenticacionController.prototype, "iniciarSesion", null);
__decorate([
    (0, common_1.UseGuards)(jwt_autenticacion_guard_1.GuardJwtAutenticacion),
    (0, common_1.Get)('perfil'),
    __param(0, (0, usuario_actual_decorator_1.UsuarioActual)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [usuario_entity_1.Usuario]),
    __metadata("design:returntype", Promise)
], AutenticacionController.prototype, "obtenerPerfil", null);
exports.AutenticacionController = AutenticacionController = __decorate([
    (0, common_1.Controller)('autenticacion'),
    __metadata("design:paramtypes", [autenticacion_service_1.AutenticacionService])
], AutenticacionController);
//# sourceMappingURL=autenticacion.controller.js.map
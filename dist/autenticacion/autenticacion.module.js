"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutenticacionModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const config_1 = require("@nestjs/config");
const autenticacion_controller_1 = require("./autenticacion.controller");
const autenticacion_service_1 = require("./autenticacion.service");
const jwt_strategy_1 = require("./strategies/jwt.strategy");
const correo_service_1 = require("./services/correo.service");
const integracion_hospital_service_1 = require("./services/integracion-hospital.service");
let AutenticacionModule = class AutenticacionModule {
};
exports.AutenticacionModule = AutenticacionModule;
exports.AutenticacionModule = AutenticacionModule = __decorate([
    (0, common_1.Module)({
        imports: [
            passport_1.PassportModule.register({ defaultStrategy: 'jwt' }),
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configuracionServicio) => ({
                    secret: configuracionServicio.get('JWT_SECRETO'),
                    signOptions: {
                        expiresIn: (configuracionServicio.get('JWT_EXPIRACION') || '1d'),
                    },
                }),
                inject: [config_1.ConfigService],
            }),
        ],
        controllers: [autenticacion_controller_1.AutenticacionController],
        providers: [
            autenticacion_service_1.AutenticacionService,
            jwt_strategy_1.EstrategiaJwt,
            correo_service_1.CorreoService,
            integracion_hospital_service_1.IntegracionHospitalService,
        ],
        exports: [autenticacion_service_1.AutenticacionService, correo_service_1.CorreoService, integracion_hospital_service_1.IntegracionHospitalService, jwt_1.JwtModule, passport_1.PassportModule],
    })
], AutenticacionModule);
//# sourceMappingURL=autenticacion.module.js.map
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
exports.ResultadosController = void 0;
const common_1 = require("@nestjs/common");
const jwt_autenticacion_guard_1 = require("../common/guards/jwt-autenticacion.guard");
const resultados_service_1 = require("./resultados.service");
let ResultadosController = class ResultadosController {
    resultadosService;
    constructor(resultadosService) {
        this.resultadosService = resultadosService;
    }
    async obtenerOrdenesLaboratorio(req, pagina, limite, clientCode) {
        return this.resultadosService.obtenerOrdenesLaboratorio(req.user, {
            pagina,
            limite,
            clientCode,
        });
    }
    async obtenerDetalleOrden(internalNumber, clientCode) {
        return this.resultadosService.obtenerDetalleOrden(internalNumber, clientCode);
    }
    async descargarPdf(pdfUrl, res) {
        return this.resultadosService.proxyPdf(pdfUrl, res);
    }
};
exports.ResultadosController = ResultadosController;
__decorate([
    (0, common_1.UseGuards)(jwt_autenticacion_guard_1.GuardJwtAutenticacion),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('pagina')),
    __param(2, (0, common_1.Query)('limite')),
    __param(3, (0, common_1.Query)('clientCode')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", Promise)
], ResultadosController.prototype, "obtenerOrdenesLaboratorio", null);
__decorate([
    (0, common_1.UseGuards)(jwt_autenticacion_guard_1.GuardJwtAutenticacion),
    (0, common_1.Post)('detalle'),
    __param(0, (0, common_1.Body)('internalNumber')),
    __param(1, (0, common_1.Body)('clientCode')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ResultadosController.prototype, "obtenerDetalleOrden", null);
__decorate([
    (0, common_1.Get)('pdf'),
    __param(0, (0, common_1.Query)('url')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ResultadosController.prototype, "descargarPdf", null);
exports.ResultadosController = ResultadosController = __decorate([
    (0, common_1.Controller)('resultados'),
    __metadata("design:paramtypes", [resultados_service_1.ResultadosService])
], ResultadosController);
//# sourceMappingURL=resultados.controller.js.map
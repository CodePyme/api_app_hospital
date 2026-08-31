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
var ResultadosService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResultadosService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const paciente_entity_1 = require("../pacientes/entities/paciente.entity");
let ResultadosService = class ResultadosService {
    static { ResultadosService_1 = this; }
    request;
    configService;
    logger = new common_1.Logger(ResultadosService_1.name);
    static tokenCache = null;
    constructor(request, configService) {
        this.request = request;
        this.configService = configService;
    }
    get baseApiUrl() {
        return (this.configService.get('LABCORE_API_URL') ||
            'http://172.28.64.81:8180/APIIntegracion/Integration.svc').replace(/\/+$/, '');
    }
    get login() {
        return this.configService.get('LABCORE_LOGIN') || 'QXBpSW50ZWdyYWNpb24=';
    }
    get password() {
        return this.configService.get('LABCORE_PASSWORD') || 'QXBpSW50ZWdyYWNpb24=';
    }
    async autenticar() {
        const ahora = Date.now();
        if (ResultadosService_1.tokenCache && ResultadosService_1.tokenCache.expiraEn > ahora) {
            return {
                authKey: ResultadosService_1.tokenCache.authKey,
                cookie: ResultadosService_1.tokenCache.cookie,
            };
        }
        const url = `${this.baseApiUrl}/Authenticate`;
        this.logger.log(`🔑 Autenticando con Labcore API en ${url}`);
        try {
            const resp = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    Login: this.login,
                    Password: this.password,
                }),
            });
            if (!resp.ok) {
                const errorText = await resp.text().catch(() => '');
                this.logger.error(`❌ Error autenticación Labcore HTTP ${resp.status}: ${errorText}`);
                throw new common_1.BadRequestException(`Error de autenticación con el servicio de laboratorios (HTTP ${resp.status})`);
            }
            const datos = await resp.json();
            const authKey = datos?.AuthKey || '';
            let cookie = '';
            const setCookie = resp.headers.get('set-cookie');
            if (setCookie) {
                const match = setCookie.match(/(X-ACCESS-TOKEN=[^;]+)/i);
                if (match) {
                    cookie = match[1];
                }
                else {
                    cookie = setCookie.split(';')[0];
                }
            }
            if (!authKey) {
                throw new common_1.BadRequestException('El servicio de laboratorios no retornó una clave de autenticación válida.');
            }
            ResultadosService_1.tokenCache = {
                authKey,
                cookie,
                expiraEn: ahora + 8 * 60 * 1000,
            };
            this.logger.log('✅ Autenticación exitosa con Labcore API');
            return { authKey, cookie };
        }
        catch (err) {
            if (err instanceof common_1.BadRequestException)
                throw err;
            this.logger.error(`❌ Excepción al autenticar en Labcore: ${err.message}`);
            throw new common_1.BadRequestException(`No fue posible conectar con el servicio de laboratorio: ${err.message}`);
        }
    }
    async obtenerHeadersPeticion() {
        const { authKey, cookie } = await this.autenticar();
        const headers = {
            'Content-Type': 'application/json',
            Authorization: authKey.startsWith('Bearer ') ? authKey : `Bearer ${authKey}`,
        };
        if (cookie) {
            headers['Cookie'] = cookie;
        }
        return headers;
    }
    async obtenerOrdenesLaboratorio(usuario, query) {
        let tipoDocumento = usuario?.tipoDocumento;
        let numeroDocumento = usuario?.numeroDocumento || usuario?.documentoIdentidad;
        if (!numeroDocumento && this.request?.tenantConexion) {
            try {
                const repoPaciente = this.request.tenantConexion.getRepository(paciente_entity_1.Paciente);
                const pacienteBd = await repoPaciente.findOne({
                    where: [
                        { correoElectronico: usuario?.correoElectronico },
                        { id: usuario?.pacienteId },
                    ],
                });
                if (pacienteBd) {
                    tipoDocumento = pacienteBd.tipoDocumento;
                    numeroDocumento = pacienteBd.numeroDocumento;
                }
            }
            catch (err) {
                this.logger.warn(`No se pudo consultar paciente en BD: ${err.message}`);
            }
        }
        if (!numeroDocumento) {
            throw new common_1.BadRequestException('No se encontró el documento del paciente en la sesión actual.');
        }
        const tipoDocFormateado = (tipoDocumento || 'CC').trim().toUpperCase();
        const numDocFormateado = String(numeroDocumento).trim();
        const headers = await this.obtenerHeadersPeticion();
        const url = `${this.baseApiUrl}/OrderInformation`;
        const bodyPeticion = {
            Page: query?.pagina ? parseInt(query.pagina, 10) : 1,
            Limit: query?.limite ? parseInt(query.limite, 10) : 50,
            ClientCode: query?.clientCode || '',
            Filters: [
                {
                    Property: 'DocumentType',
                    Operator: '=',
                    Value: tipoDocFormateado,
                },
                {
                    Property: 'DocumentNumber',
                    Operator: '=',
                    Value: numDocFormateado,
                },
            ],
        };
        this.logger.log(`🔍 Consultando órdenes de laboratorio en ${url} para ${tipoDocFormateado} ${numDocFormateado}`);
        try {
            const resp = await fetch(url, {
                method: 'POST',
                headers,
                body: JSON.stringify(bodyPeticion),
            });
            if (!resp.ok) {
                const errorText = await resp.text().catch(() => '');
                this.logger.error(`❌ Error en OrderInformation (${resp.status}): ${errorText}`);
                throw new common_1.BadRequestException(`Error al consultar órdenes de laboratorio (HTTP ${resp.status})`);
            }
            const datos = await resp.json();
            return {
                exito: true,
                mensaje: 'Órdenes de laboratorio obtenidas correctamente',
                datos: datos?.Orders || [],
                totalRegistros: datos?.TotalRecords || (datos?.Orders ? datos.Orders.length : 0),
                status: datos?.Status || {},
            };
        }
        catch (err) {
            if (err instanceof common_1.BadRequestException)
                throw err;
            this.logger.error(`❌ Excepción al obtener órdenes de laboratorio: ${err.message}`);
            throw new common_1.BadRequestException(`Error al conectar con Labcore: ${err.message}`);
        }
    }
    async obtenerDetalleOrden(internalNumber, clientCode = '') {
        if (!internalNumber) {
            throw new common_1.BadRequestException('El identificador de la orden (InternalNumber) es requerido.');
        }
        const headers = await this.obtenerHeadersPeticion();
        const url = `${this.baseApiUrl}/OrderDetail`;
        const codeReporte = this.configService.get('LABCORE_REPORT_CODE') || 'RP001';
        const bodyPeticion = {
            ClientCode: clientCode || '',
            Orders: [internalNumber],
            ReportInfo: {
                Code: codeReporte,
                OnlyURL: false,
            },
        };
        this.logger.log(`📄 Consultando detalle de orden ${internalNumber} en ${url} con ReportInfo (Code: ${codeReporte}, OnlyURL: false)`);
        try {
            const resp = await fetch(url, {
                method: 'POST',
                headers,
                body: JSON.stringify(bodyPeticion),
            });
            const responseText = await resp.text().catch(() => '');
            let datos = null;
            try {
                datos = JSON.parse(responseText);
            }
            catch (e) { }
            const ordenes = datos?.Orders || [];
            const detalle = ordenes.length > 0 ? ordenes[0] : null;
            if (detalle?.ResultPdf) {
                const esBase64 = detalle.ResultPdf.startsWith('JVBERi') || detalle.ResultPdf.length > 200;
                this.logger.log(`📑 [PDF BASE64 OFICIAL DE LABCORE RECIBIDO]: EsBase64: ${esBase64} | Longitud: ${detalle.ResultPdf.length}`);
            }
            if (detalle || (datos && datos.Status?.Success === true)) {
                if (detalle && detalle.ResultPdf) {
                    if (detalle.ResultPdf.includes('id=0') || detalle.ResultPdf.endsWith('urlKey=')) {
                        detalle.ResultPdf = null;
                    }
                }
                this.logger.log(`✅ Detalle de orden procesado con ${detalle?.Studies?.length || 0} estudio(s)`);
                return {
                    exito: true,
                    mensaje: 'Detalle de la orden obtenido correctamente',
                    datos: detalle,
                    status: datos?.Status || {},
                };
            }
            return {
                exito: true,
                mensaje: 'Detalle de la orden obtenido correctamente',
                datos: detalle,
                status: datos?.Status || {},
            };
        }
        catch (err) {
            this.logger.error(`❌ Excepción al obtener detalle de la orden: ${err.message}`);
            throw new common_1.BadRequestException(`Error al consultar el detalle en Labcore: ${err.message}`);
        }
    }
    async proxyPdf(pdfUrlKey, res) {
        if (!pdfUrlKey) {
            throw new common_1.BadRequestException('La ruta del documento PDF no es válida.');
        }
        if (pdfUrlKey.startsWith('data:application/pdf') ||
            pdfUrlKey.startsWith('JVBERi') ||
            (!pdfUrlKey.includes('/') && pdfUrlKey.length > 100)) {
            this.logger.log('📄 Sirviendo PDF desde cadena Base64 directa de Labcore');
            const base64Clean = pdfUrlKey.replace(/^data:application\/pdf;base64,/, '');
            const buffer = Buffer.from(base64Clean, 'base64');
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'inline; filename="Resultado_Laboratorio.pdf"');
            return res.send(buffer);
        }
        const urlCompleta = pdfUrlKey.startsWith('http')
            ? pdfUrlKey
            : `${this.baseApiUrl}${pdfUrlKey.startsWith('/') ? '' : '/'}${pdfUrlKey}`;
        this.logger.log(`📥 Proxying PDF desde ${urlCompleta}`);
        try {
            let resp = await fetch(urlCompleta);
            if (!resp.ok) {
                const errorAnon = await resp.clone().text().catch(() => '');
                this.logger.warn(`⚠️ Petición anónima a PDF retornó ${resp.status}: ${errorAnon}. Reintentando con autenticación...`);
                try {
                    const { authKey, cookie } = await this.autenticar();
                    const headers = {
                        Authorization: authKey.startsWith('Bearer ') ? authKey : `Bearer ${authKey}`,
                    };
                    if (cookie)
                        headers['Cookie'] = cookie;
                    resp = await fetch(urlCompleta, { headers });
                }
                catch (authErr) {
                    this.logger.warn(`No fue posible reautenticar para el PDF: ${authErr.message}`);
                }
            }
            if (!resp.ok) {
                const errorText = await resp.text().catch(() => '');
                this.logger.error(`❌ Error descargando PDF de Labcore (HTTP ${resp.status}): ${errorText}`);
                throw new common_1.BadRequestException(`El servidor de laboratorio no pudo generar el PDF (HTTP ${resp.status}). ${errorText}`);
            }
            const contentType = resp.headers.get('content-type') || 'application/pdf';
            res.setHeader('Content-Type', contentType);
            res.setHeader('Content-Disposition', 'inline; filename="Resultado_Laboratorio.pdf"');
            const arrayBuffer = await resp.arrayBuffer();
            res.send(Buffer.from(arrayBuffer));
        }
        catch (err) {
            if (err instanceof common_1.BadRequestException)
                throw err;
            this.logger.error(`❌ Excepción al descargar PDF: ${err.message}`);
            throw new common_1.BadRequestException(`Error al obtener el archivo PDF: ${err.message}`);
        }
    }
};
exports.ResultadosService = ResultadosService;
exports.ResultadosService = ResultadosService = ResultadosService_1 = __decorate([
    (0, common_1.Injectable)({ scope: common_1.Scope.REQUEST }),
    __param(0, (0, common_1.Inject)(core_1.REQUEST)),
    __metadata("design:paramtypes", [Object, config_1.ConfigService])
], ResultadosService);
//# sourceMappingURL=resultados.service.js.map
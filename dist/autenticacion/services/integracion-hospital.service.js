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
var IntegracionHospitalService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegracionHospitalService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let IntegracionHospitalService = IntegracionHospitalService_1 = class IntegracionHospitalService {
    configService;
    logger = new common_1.Logger(IntegracionHospitalService_1.name);
    constructor(configService) {
        this.configService = configService;
    }
    normalizarTipoDocumento(tipoDoc) {
        if (!tipoDoc)
            return 'CC';
        const limpio = tipoDoc.trim().toUpperCase();
        const mapa = {
            CC: 'CC',
            CEDULA: 'CC',
            'CÉDULA': 'CC',
            'CÉDULA DE CIUDADANÍA': 'CC',
            'CEDULA DE CIUDADANIA': 'CC',
            'CÉD.CIUDADANÍA': 'CC',
            'CED.CIUDADANIA': 'CC',
            TI: 'TI',
            'TARJETA DE IDENTIDAD': 'TI',
            'TARJ. IDENTIDAD': 'TI',
            CE: 'CE',
            'CÉDULA DE EXTRANJERÍA': 'CE',
            'CEDULA DE EXTRANJERIA': 'CE',
            'CÉD.EXTRANJERÍA': 'CE',
            RC: 'RC',
            'REGISTRO CIVIL': 'RC',
            PA: 'PA',
            PASAPORTE: 'PA',
            PT: 'PT',
            'PROTECCIÓN TEMPORAL': 'PT',
            'PROTECCION TEMPORAL': 'PT',
            'PERMISO POR PROTECCIÓN TEMPORAL': 'PT',
            PE: 'PE',
            'PERMISO ESPECIAL': 'PE',
            'PERMISO ESPECIAL DE PERMANENCIA': 'PE',
            AS: 'AS',
            'ADULTO SIN ID': 'AS',
            'ADULTO SIN IDENTIFICACIÓN': 'AS',
            MS: 'MS',
            'MENOR SIN ID': 'MS',
            'MENOR SIN IDENTIFICACIÓN': 'MS',
            CD: 'CD',
            'CARNET DIPLOMAT': 'CD',
            CN: 'CN',
            'CERT NACID VIVO': 'CN',
            SC: 'SC',
            SALVOCONDUCTO: 'SC',
            DE: 'DE',
            'DOC. EXTRANJERO': 'DE',
        };
        return mapa[limpio] || limpio.slice(0, 2);
    }
    normalizarFecha(fecha) {
        if (!fecha)
            return '';
        const limpia = fecha.trim();
        if (/^\d{4}-\d{2}-\d{2}$/.test(limpia)) {
            return limpia;
        }
        if (/^\d{2}[\/\-]\d{2}[\/\-]\d{4}$/.test(limpia)) {
            const partes = limpia.split(/[\/\-]/);
            return `${partes[2]}-${partes[1]}-${partes[0]}`;
        }
        const soloDigitos = limpia.replace(/\D/g, '');
        if (soloDigitos.length === 8) {
            if (soloDigitos.startsWith('19') || soloDigitos.startsWith('20')) {
                return `${soloDigitos.slice(0, 4)}-${soloDigitos.slice(4, 6)}-${soloDigitos.slice(6, 8)}`;
            }
            else {
                return `${soloDigitos.slice(4, 8)}-${soloDigitos.slice(2, 4)}-${soloDigitos.slice(0, 2)}`;
            }
        }
        return limpia;
    }
    getEndpointDemograficos() {
        const urlConfigurada = this.configService.get('DEMOGRAFICOS_API_URL');
        if (urlConfigurada) {
            return urlConfigurada;
        }
        const entorno = this.configService.get('ENTORNO', 'development');
        switch (entorno) {
            case 'production':
            case 'prd':
                return 'http://aspop.hospital.com:50000/RESTAdapter/integra_prd/v1/datosdemograficospaciente';
            case 'quality':
            case 'qas':
            case 'test':
                return 'http://aspod.hospital.com:50000/RESTAdapter/integra_qas/v1/datosdemograficospaciente';
            case 'development':
            case 'dev':
            default:
                return 'http://aspod.hospital.com:50000/RESTAdapter/integra_dev/v1/datosdemograficospaciente';
        }
    }
    async consultarDatosDemograficos(parametros) {
        const baseUrl = this.getEndpointDemograficos();
        const centroSanitario = this.configService.get('DEMOGRAFICOS_CENTRO_SANITARIO', 'HSVM');
        const tipoDocSap = this.normalizarTipoDocumento(parametros.tipoDocumento);
        const numeroDocLimpio = parametros.numeroDocumento.trim();
        const params = new URLSearchParams({
            Centro_Sanitario: centroSanitario,
            Tipo_documento: tipoDocSap,
            Numero_documento: numeroDocLimpio,
        });
        const urlCompleta = `${baseUrl}?${params.toString()}`;
        const timeoutMs = this.configService.get('DEMOGRAFICOS_TIMEOUT_MS', 10000);
        const authUser = this.configService.get('DEMOGRAFICOS_AUTH_USER');
        const authPass = this.configService.get('DEMOGRAFICOS_AUTH_PASS');
        console.log('\n======================================================');
        console.log('🚀 [PETICIÓN A SAP PO / HOSPITAL]');
        console.log('URL:', urlCompleta);
        console.log('Parámetros:', {
            Centro_Sanitario: centroSanitario,
            Tipo_documento: tipoDocSap,
            Numero_documento: numeroDocLimpio,
            Fecha_nacimiento_ingresada: parametros.fechaNacimiento,
        });
        console.log('======================================================\n');
        this.logger.log(`🏥 [GET SAP PO] Consultando demográficos en: ${urlCompleta}`);
        try {
            const headers = {
                Accept: 'application/json',
            };
            if (authUser && authPass) {
                const credencialesBase64 = Buffer.from(`${authUser}:${authPass}`).toString('base64');
                headers['Authorization'] = `Basic ${credencialesBase64}`;
                this.logger.log(`🔐 Autenticación Basic Auth incluida para usuario: ${authUser}`);
            }
            else {
                this.logger.warn(`⚠️ DEMOGRAFICOS_AUTH_USER / DEMOGRAFICOS_AUTH_PASS no están configurados en el .env`);
            }
            const controladorAbort = new AbortController();
            const temporizador = setTimeout(() => controladorAbort.abort(), timeoutMs);
            const respuesta = await fetch(urlCompleta, {
                method: 'GET',
                headers,
                signal: controladorAbort.signal,
            }).finally(() => clearTimeout(temporizador));
            if (respuesta.ok) {
                const datos = await respuesta.json();
                console.log('\n======================================================');
                console.log('📥 [RESPUESTA DEL API HOSPITAL / SAP PO] HTTP Status:', respuesta.status);
                console.log(JSON.stringify(datos, null, 2));
                console.log('======================================================\n');
                this.logger.log(`📥 Respuesta recibida de SAP PO: ${JSON.stringify(datos)}`);
                if (datos?.IdMessageDatosPaciente && datos.IdMessageDatosPaciente !== '000') {
                    console.error(`❌ SAP PO rechazó la búsqueda [${datos.IdMessageDatosPaciente}]: ${datos.MessageDatosPaciente}`);
                    this.logger.warn(`❌ SAP PO rechazó la búsqueda [${datos.IdMessageDatosPaciente}]: ${datos.MessageDatosPaciente}`);
                    throw new common_1.BadRequestException(datos.MessageDatosPaciente || 'No se encontró el paciente con la información suministrada.');
                }
                const paciente = this.mapearRespuestaDemograficos(datos, parametros);
                if (paciente) {
                    console.log('✅ Paciente extraído correctamente:', paciente);
                    if (paciente.fechaNacimiento && parametros.fechaNacimiento) {
                        const fechaSapNorm = this.normalizarFecha(paciente.fechaNacimiento);
                        const fechaIngresadaNorm = this.normalizarFecha(parametros.fechaNacimiento);
                        if (fechaSapNorm !== fechaIngresadaNorm) {
                            console.error(`❌ Fecha de nacimiento no coincide para doc ${numeroDocLimpio}: SAP=${fechaSapNorm} vs Ingresada=${fechaIngresadaNorm}`);
                            this.logger.warn(`❌ Fecha de nacimiento no coincide para doc ${numeroDocLimpio}: SAP=${fechaSapNorm} vs Ingresada=${fechaIngresadaNorm}`);
                            throw new common_1.BadRequestException('La fecha de nacimiento no coincide con la registrada en el sistema.');
                        }
                    }
                    return paciente;
                }
            }
            else {
                const errorText = await respuesta.text().catch(() => '');
                console.error('\n======================================================');
                console.error(`❌ [ERROR HTTP SAP PO] Status: ${respuesta.status} ${respuesta.statusText}`);
                console.error('Detalle:', errorText);
                console.error('======================================================\n');
                this.logger.error(`❌ Error HTTP en SAP PO: Status ${respuesta.status} ${respuesta.statusText} - Detalle: ${errorText}`);
                if (respuesta.status === 401 || respuesta.status === 403) {
                    console.error(`❌ [AUTENTICACIÓN RECHAZADA POR SAP PO] Usuario: ${authUser} - Status: ${respuesta.status}`);
                    throw new common_1.BadRequestException('Error de autenticación con el servicio de SAP PO (HTTP 401 - Not Authorized). Por favor verifica el usuario y contraseña en el archivo .env.');
                }
                throw new common_1.BadRequestException(`El servicio del hospital retornó un error (HTTP ${respuesta.status}).`);
            }
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException) {
                throw error;
            }
            console.error('\n======================================================');
            console.error('❌ [ERROR DE CONEXIÓN A SAP PO]');
            console.error('Mensaje:', error.message);
            console.error('======================================================\n');
            this.logger.error(`❌ Error de conexión al endpoint de SAP PO (${urlCompleta}): ${error.message}`, error.stack);
            throw new common_1.BadRequestException(`No fue posible comunicarse con el servicio de datos del hospital (${error.message}). Por favor verifica la red y configuración en .env.`);
        }
        return null;
    }
    async consultarPorEpisodio(parametros) {
        const baseUrl = this.getEndpointDemograficos();
        const centroSanitario = parametros.centroSanitario || this.configService.get('DEMOGRAFICOS_CENTRO_SANITARIO', 'HSVM');
        const episodioLimpio = String(parametros.episodio).trim();
        const params = new URLSearchParams({
            Centro_Sanitario: centroSanitario,
            Episodio: episodioLimpio,
        });
        const urlCompleta = `${baseUrl}?${params.toString()}`;
        const timeoutMs = this.configService.get('DEMOGRAFICOS_TIMEOUT_MS', 15000);
        const authUser = this.configService.get('DEMOGRAFICOS_AUTH_USER', 'po_divergent');
        const authPass = this.configService.get('DEMOGRAFICOS_AUTH_PASS', 'QgXz18YcMqg4iu');
        console.log('\n======================================================');
        console.log('🚀 [CONSULTA SAP PO POR EPISODIO]');
        console.log('URL:', urlCompleta);
        console.log('Parámetros:', { Centro_Sanitario: centroSanitario, Episodio: episodioLimpio });
        console.log('======================================================\n');
        try {
            const headers = {
                Accept: 'application/json',
            };
            if (authUser && authPass) {
                const credencialesBase64 = Buffer.from(`${authUser}:${authPass}`).toString('base64');
                headers['Authorization'] = `Basic ${credencialesBase64}`;
            }
            const controladorAbort = new AbortController();
            const temporizador = setTimeout(() => controladorAbort.abort(), timeoutMs);
            const respuesta = await fetch(urlCompleta, {
                method: 'GET',
                headers,
                signal: controladorAbort.signal,
            }).finally(() => clearTimeout(temporizador));
            if (respuesta.ok) {
                const datos = await respuesta.json();
                console.log('\n======================================================');
                console.log('📥 [RESPUESTA EPISODIO SAP PO] HTTP Status:', respuesta.status);
                console.log(JSON.stringify(datos, null, 2));
                console.log('======================================================\n');
                if (datos?.IdMessageDatosPaciente && datos.IdMessageDatosPaciente !== '000') {
                    throw new common_1.BadRequestException(datos.MessageDatosPaciente || `No se encontró información para el episodio ${episodioLimpio}.`);
                }
                return this.mapearRespuestaDemograficos(datos, {
                    tipoDocumento: 'CC',
                    numeroDocumento: '',
                    fechaNacimiento: '',
                });
            }
            else {
                const errorText = await respuesta.text().catch(() => '');
                this.logger.error(`❌ Error HTTP en consulta por episodio SAP PO: Status ${respuesta.status} - ${errorText}`);
                throw new common_1.BadRequestException(`Error al consultar el episodio en el hospital (HTTP ${respuesta.status})`);
            }
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException)
                throw error;
            this.logger.error(`❌ Error de conexión al consultar episodio en SAP PO: ${error.message}`);
            throw new common_1.BadRequestException(`No fue posible consultar el episodio: ${error.message}`);
        }
    }
    mapearRespuestaDemograficos(datos, parametros) {
        const estructura = datos?.DatosPaciente || datos?.paciente || datos?.datosPaciente;
        if (!estructura) {
            return null;
        }
        let nombres = [estructura.Primer_nombre, estructura.Segundo_nombre]
            .filter(Boolean)
            .join(' ')
            .trim();
        let apellidos = [estructura.Primer_apellido, estructura.Segundo_apellido]
            .filter(Boolean)
            .join(' ')
            .trim();
        if (!nombres && estructura.Nombre_completo) {
            const partes = estructura.Nombre_completo.trim().split(/\s+/);
            if (partes.length > 2) {
                nombres = partes.slice(0, 2).join(' ');
                apellidos = partes.slice(2).join(' ');
            }
            else if (partes.length === 2) {
                nombres = partes[0];
                apellidos = partes[1];
            }
            else {
                nombres = partes[0] || 'Paciente';
                apellidos = '';
            }
        }
        if (!nombres) {
            nombres = estructura.nombres || estructura.primerNombre || 'Paciente';
        }
        if (!apellidos) {
            apellidos = estructura.apellidos || estructura.primerApellido || '';
        }
        const nombreCompleto = estructura.Nombre_completo || `${nombres} ${apellidos}`.trim();
        const direcciones = estructura.Direcciones;
        let correoElectronico = '';
        if (Array.isArray(direcciones) && direcciones.length > 0) {
            correoElectronico = direcciones[0]?.Email || direcciones[0]?.email || '';
        }
        else if (direcciones && typeof direcciones === 'object') {
            correoElectronico = direcciones.Email || direcciones.email || '';
        }
        if (!correoElectronico) {
            correoElectronico =
                estructura.correoElectronico ||
                    estructura.email ||
                    '';
        }
        let telefono = estructura.Telefono_principal ? String(estructura.Telefono_principal) : '';
        if (!telefono) {
            const otros = estructura.Otros_numeros_telefonicos;
            if (Array.isArray(otros) && otros.length > 0) {
                telefono = String(otros[0]?.Telefono || otros[0]?.telefono || '');
            }
            else if (otros && typeof otros === 'object') {
                telefono = String(otros.Telefono || otros.telefono || '');
            }
        }
        const direccionObj = Array.isArray(direcciones) && direcciones.length > 0
            ? direcciones[0]
            : direcciones && typeof direcciones === 'object'
                ? direcciones
                : {};
        const direccionStr = direccionObj?.Direccion || estructura.direccion || null;
        const poblacionStr = direccionObj?.Poblacion || estructura.poblacion || null;
        const deptoStr = direccionObj?.Departamento || estructura.departamento || null;
        const paisStr = direccionObj?.Pais || estructura.pais || null;
        const direccionCompleta = [direccionStr, poblacionStr, deptoStr, paisStr]
            .filter(Boolean)
            .join(', ');
        return {
            numeroPaciente: estructura.Numero_paciente ? String(estructura.Numero_paciente) : undefined,
            nombres,
            apellidos,
            nombreCompleto,
            tipoDocumento: estructura.Tipo_documento || parametros.tipoDocumento,
            descDocumento: estructura.Desc_documento || undefined,
            numeroDocumento: estructura.Numero_documento ? String(estructura.Numero_documento) : parametros.numeroDocumento,
            fechaNacimiento: estructura.Fecha_nacimiento || parametros.fechaNacimiento,
            edad: estructura.Edad || undefined,
            sexo: estructura.Sexo || estructura.idSexo || undefined,
            correoElectronico,
            telefono: telefono || undefined,
            direccion: direccionStr || undefined,
            ciudad: poblacionStr || undefined,
            departamento: deptoStr || undefined,
            pais: paisStr || undefined,
            direccionCompleta: direccionCompleta || undefined,
            genero: (estructura.Sexo || estructura.idSexo || 'otro').toLowerCase(),
        };
    }
};
exports.IntegracionHospitalService = IntegracionHospitalService;
exports.IntegracionHospitalService = IntegracionHospitalService = IntegracionHospitalService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], IntegracionHospitalService);
//# sourceMappingURL=integracion-hospital.service.js.map
import { Injectable, Logger, BadRequestException, Inject, Scope } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { REQUEST } from '@nestjs/core';
import type { Request, Response } from 'express';
import { Paciente } from '../pacientes/entities/paciente.entity';

export interface FiltroLabcore {
  Property: string;
  Operator: string;
  Value: string;
}

@Injectable({ scope: Scope.REQUEST })
export class ResultadosService {
  private readonly logger = new Logger(ResultadosService.name);

  public static readonly MENSAJE_CONFIDENCIAL =
    'EL RESULTADO ESTÁ LISTO PERO DEBE RECLAMARSE DE FORMA PRESENCIAL EN LA INSTITUCIÓN';

  private static readonly PATRONES_CONFIDENCIALES: RegExp[] = [
    /\b(vih|hiv)\b/i,
    /inmunodeficiencia\s+humana/i,
    /carga\s+viral.*(vih|hiv)/i,
    /western\s+blot/i,
    /tuberculosis/i,
    /\btbc\b/i,
    /\bbk\b/i,
    /baciloscop/i,
    /mycobacterium/i,
    /hepatitis/i,
    /\b(hbsag|anti-hcv|anti-vhc|vhb|vhc)\b/i,
    /\b(sifilis|sífilis|treponema|vdrl|rpr)\b/i,
  ];

  public static esConfidencial(texto: string): boolean {
    if (!texto) return false;
    return ResultadosService.PATRONES_CONFIDENCIALES.some((reg) => reg.test(texto));
  }

  // Caché de token estático de clase para reutilizar en peticiones
  private static tokenCache: { authKey: string; cookie: string; expiraEn: number } | null = null;

  constructor(
    @Inject(REQUEST) private readonly request: Request,
    private readonly configService: ConfigService,
  ) {}

  private get baseApiUrl(): string {
    const url = this.configService.get<string>('LABCORE_API_URL');
    if (!url) {
      this.logger.error('❌ La variable LABCORE_API_URL no está configurada en el archivo .env');
      throw new BadRequestException('El servicio de laboratorios no está configurado (LABCORE_API_URL faltante en .env).');
    }
    return url.trim().replace(/\/+$/, '');
  }

  private get login(): string {
    const login = this.configService.get<string>('LABCORE_LOGIN');
    if (!login) {
      this.logger.error('❌ La variable LABCORE_LOGIN no está configurada en el archivo .env');
      throw new BadRequestException('Credenciales de laboratorios no configuradas (LABCORE_LOGIN faltante en .env).');
    }
    return login.trim();
  }

  private get password(): string {
    const pass = this.configService.get<string>('LABCORE_PASSWORD');
    if (!pass) {
      this.logger.error('❌ La variable LABCORE_PASSWORD no está configurada en el archivo .env');
      throw new BadRequestException('Credenciales de laboratorios no configuradas (LABCORE_PASSWORD faltante en .env).');
    }
    return pass.trim();
  }

  private get timeoutMs(): number {
    const val = this.configService.get<string | number>('LABCORE_TIMEOUT_MS');
    return val ? parseInt(String(val), 10) : 10000;
  }

  /**
   * Autentica con el API de Integración de Labcore y obtiene el AuthKey y la Cookie
   */
  async autenticar(): Promise<{ authKey: string; cookie: string }> {
    const ahora = Date.now();
    if (ResultadosService.tokenCache && ResultadosService.tokenCache.expiraEn > ahora) {
      return {
        authKey: ResultadosService.tokenCache.authKey,
        cookie: ResultadosService.tokenCache.cookie,
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
        signal: AbortSignal.timeout(this.timeoutMs),
      });

      if (!resp.ok) {
        const errorText = await resp.text().catch(() => '');
        this.logger.error(`❌ Error autenticación Labcore HTTP ${resp.status}: ${errorText}`);
        throw new BadRequestException(`Error de autenticación con el servicio de laboratorios (HTTP ${resp.status})`);
      }

      const datos = await resp.json();
      const authKey = datos?.AuthKey || '';

      // Extraer Cookie de los headers
      let cookie = '';
      const setCookie = resp.headers.get('set-cookie');
      if (setCookie) {
        const match = setCookie.match(/(X-ACCESS-TOKEN=[^;]+)/i);
        if (match) {
          cookie = match[1];
        } else {
          cookie = setCookie.split(';')[0];
        }
      }

      if (!authKey) {
        throw new BadRequestException('El servicio de laboratorios no retornó una clave de autenticación válida.');
      }

      // Guardar en caché por 8 minutos (el token suele durar 10 min)
      ResultadosService.tokenCache = {
        authKey,
        cookie,
        expiraEn: ahora + 8 * 60 * 1000,
      };

      this.logger.log('✅ Autenticación exitosa con Labcore API');
      return { authKey, cookie };
    } catch (err: any) {
      if (err instanceof BadRequestException) throw err;
      this.logger.error(`❌ Excepción al autenticar en Labcore: ${err.message}`);
      throw new BadRequestException(`No fue posible conectar con el servicio de laboratorio: ${err.message}`);
    }
  }

  /**
   * Obtiene los encabezados HTTP necesarios para las peticiones a Labcore
   */
  private async obtenerHeadersPeticion(): Promise<Record<string, string>> {
    const { authKey, cookie } = await this.autenticar();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Authorization: authKey.startsWith('Bearer ') ? authKey : `Bearer ${authKey}`,
    };
    if (cookie) {
      headers['Cookie'] = cookie;
    }
    return headers;
  }

  /**
   * Obtiene las órdenes de laboratorio para el paciente autenticado
   */
  async obtenerOrdenesLaboratorio(usuario: any, query: any) {
    let tipoDocumento = usuario?.tipoDocumento;
    let numeroDocumento = usuario?.numeroDocumento || usuario?.documentoIdentidad;

    // Si el usuario en sesión no trae el número de documento, buscarlo en la BD del tenant
    if (!numeroDocumento && this.request?.tenantConexion) {
      try {
        const repoPaciente = this.request.tenantConexion.getRepository(Paciente);
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
      } catch (err: any) {
        this.logger.warn(`No se pudo consultar paciente en BD: ${err.message}`);
      }
    }

    if (!numeroDocumento) {
      throw new BadRequestException('No se encontró el documento del paciente en la sesión actual.');
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
        signal: AbortSignal.timeout(this.timeoutMs),
      });

      if (!resp.ok) {
        const errorText = await resp.text().catch(() => '');
        this.logger.error(`❌ Error en OrderInformation (${resp.status}): ${errorText}`);
        throw new BadRequestException(`Error al consultar órdenes de laboratorio (HTTP ${resp.status})`);
      }

      const datos = await resp.json();
      const ordenesProcesadas = (datos?.Orders || []).map((ord: any) => {
        const estudios = ord.Studies || [];
        const esConfidencial = estudios.some(
          (est: any) =>
            ResultadosService.esConfidencial(est.StudyName) ||
            ResultadosService.esConfidencial(est.Code),
        );
        return {
          ...ord,
          EsConfidencial: esConfidencial,
        };
      });

      return {
        exito: true,
        mensaje: 'Órdenes de laboratorio obtenidas correctamente',
        datos: ordenesProcesadas,
        totalRegistros: datos?.TotalRecords || ordenesProcesadas.length,
        status: datos?.Status || {},
      };
    } catch (err: any) {
      if (err instanceof BadRequestException) throw err;
      this.logger.error(`❌ Excepción al obtener órdenes de laboratorio: ${err.message}`);
      throw new BadRequestException(`Error al conectar con Labcore: ${err.message}`);
    }
  }

  /**
   * Obtiene el detalle (estudios, analitos, PDF) de una o más órdenes
   */
  async obtenerDetalleOrden(internalNumber: string, clientCode = '') {
    if (!internalNumber) {
      throw new BadRequestException('El identificador de la orden (InternalNumber) es requerido.');
    }

    const headers = await this.obtenerHeadersPeticion();
    const url = `${this.baseApiUrl}/OrderDetail`;

    const codeReporte = this.configService.get<string>('LABCORE_REPORT_CODE') || 'RP001';
    const bodyPeticion: any = {
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
        signal: AbortSignal.timeout(this.timeoutMs),
      });

      const responseText = await resp.text().catch(() => '');
      let datos: any = null;
      try {
        datos = JSON.parse(responseText);
      } catch (e) {}

      const ordenes = datos?.Orders || [];
      const detalle = ordenes.length > 0 ? ordenes[0] : null;

      if (detalle?.ResultPdf) {
        const esBase64 = detalle.ResultPdf.startsWith('JVBERi') || detalle.ResultPdf.length > 200;
        this.logger.log(`📑 [PDF BASE64 OFICIAL DE LABCORE RECIBIDO]: EsBase64: ${esBase64} | Longitud: ${detalle.ResultPdf.length}`);
      }

      // Evaluar confidencialidad de la orden o sus analitos (VIH, tuberculosis, hepatitis, etc.)
      if (detalle) {
        let esConfidencial = false;
        if (Array.isArray(detalle.Studies)) {
          for (const estudio of detalle.Studies) {
            if (ResultadosService.esConfidencial(estudio.StudyName)) {
              esConfidencial = true;
              break;
            }
            if (Array.isArray(estudio.Analytes)) {
              for (const ana of estudio.Analytes) {
                if (
                  ResultadosService.esConfidencial(ana.AnalyteName) ||
                  ResultadosService.esConfidencial(ana.Method)
                ) {
                  esConfidencial = true;
                  break;
                }
              }
            }
            if (esConfidencial) break;
          }
        }

        if (esConfidencial) {
          detalle.EsConfidencial = true;
          detalle.MensajeConfidencial = ResultadosService.MENSAJE_CONFIDENCIAL;
          detalle.ResultPdf = null; // Suprimir descarga de PDF en línea

          // Ocultar valores detallados de analitos para evitar exposición
          if (Array.isArray(detalle.Studies)) {
            detalle.Studies.forEach((estudio: any) => {
              estudio.EsConfidencial = true;
              if (Array.isArray(estudio.Analytes)) {
                estudio.Analytes.forEach((ana: any) => {
                  ana.Result = '';
                  ana.ResultInterpretation = '';
                  ana.TextualReference = '';
                  ana.ReferencesRanges = null;
                  ana.EsConfidencial = true;
                });
              }
            });
          }
        }
      }

      // Si Labcore entregó el objeto Orders con los analitos
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
    } catch (err: any) {
      if (err instanceof BadRequestException) throw err;
      this.logger.error(`❌ Excepción al obtener detalle de la orden: ${err.message}`);
      throw new BadRequestException(`Error al consultar el detalle en Labcore: ${err.message}`);
    }
  }

  /**
   * Proxy para descargar o visualizar el reporte PDF de Labcore (soporta tanto Base64 como URL)
   */
  async proxyPdf(pdfUrlKey: string, res: Response) {
    if (!pdfUrlKey) {
      throw new BadRequestException('La ruta del documento PDF no es válida.');
    }

    if (ResultadosService.esConfidencial(pdfUrlKey)) {
      throw new BadRequestException(ResultadosService.MENSAJE_CONFIDENCIAL);
    }

    // 1. Si pdfUrlKey ya es un string Base64 del PDF (comienza con JVBERi o data:application/pdf)
    if (
      pdfUrlKey.startsWith('data:application/pdf') ||
      pdfUrlKey.startsWith('JVBERi') ||
      (!pdfUrlKey.includes('/') && pdfUrlKey.length > 100)
    ) {
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
      // 2. Intentar petición anónima (según especificación Labcore: RecuperarDocumento es anónimo)
      let resp = await fetch(urlCompleta, { signal: AbortSignal.timeout(this.timeoutMs) });

      // 3. Fallback a petición con autenticación
      if (!resp.ok) {
        const errorAnon = await resp.clone().text().catch(() => '');
        this.logger.warn(`⚠️ Petición anónima a PDF retornó ${resp.status}: ${errorAnon}. Reintentando con autenticación...`);

        try {
          const { authKey, cookie } = await this.autenticar();
          const headers: Record<string, string> = {
            Authorization: authKey.startsWith('Bearer ') ? authKey : `Bearer ${authKey}`,
          };
          if (cookie) headers['Cookie'] = cookie;

          resp = await fetch(urlCompleta, { headers, signal: AbortSignal.timeout(this.timeoutMs) });
        } catch (authErr: any) {
          this.logger.warn(`No fue posible reautenticar para el PDF: ${authErr.message}`);
        }
      }

      if (!resp.ok) {
        const errorText = await resp.text().catch(() => '');
        this.logger.error(`❌ Error descargando PDF de Labcore (HTTP ${resp.status}): ${errorText}`);
        throw new BadRequestException(`El servidor de laboratorio no pudo generar el PDF (HTTP ${resp.status}). ${errorText}`);
      }

      const contentType = resp.headers.get('content-type') || 'application/pdf';
      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Disposition', 'inline; filename="Resultado_Laboratorio.pdf"');

      const arrayBuffer = await resp.arrayBuffer();
      res.send(Buffer.from(arrayBuffer));
    } catch (err: any) {
      if (err instanceof BadRequestException) throw err;
      this.logger.error(`❌ Excepción al descargar PDF: ${err.message}`);
      throw new BadRequestException(`Error al obtener el archivo PDF: ${err.message}`);
    }
  }
}

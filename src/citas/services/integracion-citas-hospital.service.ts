import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface DetalleCitaSap {
  idCita: string;
  fecha: string;
  hora: string;
  modoAtencion: string;
  ubicacion: string;
  idUnidadEdificio?: string;
  descUnidadEdificio?: string;
  unidadTratamiento?: string;
  tipoPlanificacion?: string;
  especialidad: string;
  medicoTratante: string;
  aseguradora?: string;
  estado?: string;
}

export interface RespuestaAgendaSap {
  idMessage: string;
  message: string;
  paciente?: {
    tipoDocumento: string;
    numeroDocumento: string;
    nombreCompleto: string;
    sexo?: string;
  };
  citas: DetalleCitaSap[];
}

export interface RespuestaCancelacionSap {
  idMessage: string;
  message: string;
  exitosa: boolean;
}

@Injectable()
export class IntegracionCitasHospitalService {
  private readonly logger = new Logger(IntegracionCitasHospitalService.name);

  constructor(private readonly configService: ConfigService) {}

  private normalizarTipoDocumento(tipoDoc: string): string {
    if (!tipoDoc) return 'CC';
    const limpio = tipoDoc.trim().toUpperCase();

    const mapa: Record<string, string> = {
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

  private getEndpointAgenda(): string {
    const urlConfigurada = this.configService.get<string>('CITAS_API_URL');
    if (urlConfigurada) {
      return urlConfigurada;
    }

    const demoUrl = this.configService.get<string>('DEMOGRAFICOS_API_URL', '');
    if (demoUrl) {
      return demoUrl.replace('datosdemograficospaciente', 'appointmentlistpatient');
    }

    const entorno = this.configService.get<string>('ENTORNO', 'development');
    switch (entorno) {
      case 'production':
      case 'prd':
        return 'http://aspop.hospital.com:50000/RESTAdapter/integra_prd/v1/appointmentlistpatient';
      case 'quality':
      case 'qas':
      case 'test':
        return 'http://aspod.hospital.com:50000/RESTAdapter/integra_qas/v1/appointmentlistpatient';
      case 'development':
      case 'dev':
      default:
        return 'http://aspod.hospital.com:50000/RESTAdapter/integra_dev/v1/appointmentlistpatient';
    }
  }

  private getEndpointCancelarCita(): string {
    const urlConfigurada = this.configService.get<string>('CANCELAR_CITA_API_URL');
    if (urlConfigurada) {
      return urlConfigurada;
    }

    const demoUrl = this.configService.get<string>('DEMOGRAFICOS_API_URL', '');
    if (demoUrl) {
      return demoUrl.replace('datosdemograficospaciente', 'cancelappointment');
    }

    const entorno = this.configService.get<string>('ENTORNO', 'development');
    switch (entorno) {
      case 'production':
      case 'prd':
        return 'http://aspop.hospital.com:50000/RESTAdapter/integra_prd/v1/cancelappointment';
      case 'quality':
      case 'qas':
      case 'test':
        return 'http://aspod.hospital.com:50000/RESTAdapter/integra_qas/v1/cancelappointment';
      case 'development':
      case 'dev':
      default:
        return 'http://aspod.hospital.com:50000/RESTAdapter/integra_dev/v1/cancelappointment';
    }
  }

  /**
   * Consulta la agenda del paciente autenticado en SAP PO
   */
  async consultarAgendaPaciente(parametros: {
    tipoDocumento: string;
    numeroDocumento: string;
  }): Promise<RespuestaAgendaSap> {
    const baseUrl = this.getEndpointAgenda();
    const centroSanitario = this.configService.get<string>('DEMOGRAFICOS_CENTRO_SANITARIO', 'HSVM');
    const tipoDocSap = this.normalizarTipoDocumento(parametros.tipoDocumento);
    const numeroDocLimpio = parametros.numeroDocumento.trim();

    const params = new URLSearchParams({
      Centro_Sanitario: centroSanitario,
      TDocumento: tipoDocSap,
      NDocumento: numeroDocLimpio,
    });

    const urlCompleta = `${baseUrl}?${params.toString()}`;
    const timeoutMs = this.configService.get<number>('CITAS_TIMEOUT_MS', 15000);
    const authUser = this.configService.get<string>('DEMOGRAFICOS_AUTH_USER', 'po_divergent');
    const authPass = this.configService.get<string>('DEMOGRAFICOS_AUTH_PASS', 'QgXz18YcMqg4iu');

    console.log('\n======================================================');
    console.log('🚀 [CONSULTA AGENDA SAP PO]');
    console.log('URL:', urlCompleta);
    console.log('Paciente:', { tipoDocSap, numeroDocLimpio });
    console.log('======================================================\n');

    try {
      const headers: Record<string, string> = {
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
        console.log('📥 [RESPUESTA AGENDA SAP PO] HTTP Status:', respuesta.status);
        console.log(JSON.stringify(datos, null, 2));
        console.log('======================================================\n');

        return this.mapearRespuestaAgenda(datos);
      } else {
        const errorText = await respuesta.text().catch(() => '');
        this.logger.error(
          `❌ Error HTTP en SAP PO Agenda: Status ${respuesta.status} ${respuesta.statusText} - ${errorText}`,
        );
        return {
          idMessage: 'ERR_HTTP',
          message: `Error al consultar la agenda del hospital (HTTP ${respuesta.status})`,
          citas: [],
        };
      }
    } catch (error: any) {
      this.logger.error(`❌ Error de conexión al consultar agenda SAP PO: ${error.message}`);
      return {
        idMessage: 'ERR_CONN',
        message: 'No fue posible comunicarse con el servicio de citas del hospital.',
        citas: [],
      };
    }
  }

  /**
   * Cancela una cita médica en SAP PO mediante petición PUT
   */
  async cancelarCitaSAP(parametros: {
    idCita: string;
    idMotivo: string;
    limiteHoras?: number;
  }): Promise<RespuestaCancelacionSap> {
    const baseUrl = this.getEndpointCancelarCita();
    const idCitaLimpio = String(parametros.idCita).trim();
    const idMotivo = parametros.idMotivo || 'M11';
    const limiteHoras = parametros.limiteHoras ?? this.configService.get<number>('CITAS_CANCELAR_LIMITE_HORAS', 24);

    const params = new URLSearchParams({
      IdCita: idCitaLimpio,
      IdMotivo: idMotivo,
      Limite_Horas: String(limiteHoras),
    });

    const urlCompleta = `${baseUrl}?${params.toString()}`;
    const timeoutMs = this.configService.get<number>('CITAS_TIMEOUT_MS', 15000);
    const authUser = this.configService.get<string>('DEMOGRAFICOS_AUTH_USER', 'po_divergent');
    const authPass = this.configService.get<string>('DEMOGRAFICOS_AUTH_PASS', 'QgXz18YcMqg4iu');

    console.log('\n======================================================');
    console.log('🚀 [CANCELACIÓN CITA SAP PO - PUT]');
    console.log('URL:', urlCompleta);
    console.log('Parámetros:', { IdCita: idCitaLimpio, IdMotivo: idMotivo, Limite_Horas: limiteHoras });
    console.log('======================================================\n');

    try {
      const headers: Record<string, string> = {
        Accept: 'application/json',
      };

      if (authUser && authPass) {
        const credencialesBase64 = Buffer.from(`${authUser}:${authPass}`).toString('base64');
        headers['Authorization'] = `Basic ${credencialesBase64}`;
      }

      const controladorAbort = new AbortController();
      const temporizador = setTimeout(() => controladorAbort.abort(), timeoutMs);

      const respuesta = await fetch(urlCompleta, {
        method: 'PUT',
        headers,
        signal: controladorAbort.signal,
      }).finally(() => clearTimeout(temporizador));

      if (respuesta.ok) {
        const datos = await respuesta.json();
        console.log('\n======================================================');
        console.log('📥 [RESPUESTA CANCELACIÓN SAP PO] HTTP Status:', respuesta.status);
        console.log(JSON.stringify(datos, null, 2));
        console.log('======================================================\n');

        const idMessage = datos?.IdMessage || '000';
        const message = datos?.Message || 'Cancelación procesada';
        const exitosa = idMessage === '000';

        return {
          idMessage,
          message,
          exitosa,
        };
      } else {
        const errorText = await respuesta.text().catch(() => '');
        this.logger.error(`❌ Error HTTP en Cancelación SAP PO: Status ${respuesta.status} - ${errorText}`);
        return {
          idMessage: 'ERR_HTTP',
          message: `El servidor del hospital retornó un error (HTTP ${respuesta.status})`,
          exitosa: false,
        };
      }
    } catch (error: any) {
      this.logger.error(`❌ Error de conexión al cancelar cita en SAP PO: ${error.message}`);
      return {
        idMessage: 'ERR_CONN',
        message: `No fue posible comunicarse con el servicio de citas: ${error.message}`,
        exitosa: false,
      };
    }
  }

  private mapearRespuestaAgenda(datos: any): RespuestaAgendaSap {
    const idMessage = datos?.IdMessage || '000';
    const message = datos?.Message || '';
    const patientDetails = datos?.PatientDetails || {};

    let citasRaw = patientDetails?.AppointmentDetails || [];
    if (!Array.isArray(citasRaw)) {
      citasRaw = citasRaw ? [citasRaw] : [];
    }

    const citas: DetalleCitaSap[] = citasRaw.map((c: any) => {
      const fecha = c.Fecha || '';
      const hora = c.Hora || '';
      return {
        idCita: String(c.IdCita || ''),
        fecha,
        hora,
        modoAtencion: c.Modo_atencion || 'Presencial',
        ubicacion: c.Ubicacion || '',
        idUnidadEdificio: c.Id_unidad_edificio || '',
        descUnidadEdificio: c.Desc_unidad_edificio || '',
        unidadTratamiento: c.Desc_OU_trat || '',
        tipoPlanificacion: c.Tp_Planif || '',
        especialidad: c.Especialidad || 'Medicina General',
        medicoTratante: c.PersTratam || 'Médico Asignado',
        aseguradora: c.Aseguradora || '',
        estado: 'programada',
      };
    });

    // Ordenar de más próxima a más lejana
    citas.sort((a, b) => {
      const fechaA = `${a.fecha}T${a.hora}`;
      const fechaB = `${b.fecha}T${b.hora}`;
      return fechaA.localeCompare(fechaB);
    });

    return {
      idMessage,
      message,
      paciente: patientDetails?.Nom_paciente
        ? {
            tipoDocumento: patientDetails.Tip_documento || '',
            numeroDocumento: String(patientDetails.Num_documento || ''),
            nombreCompleto: patientDetails.Nom_paciente || '',
            sexo: patientDetails.Sexo || '',
          }
        : undefined,
      citas,
    };
  }
}

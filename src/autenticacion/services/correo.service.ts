import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

export interface ParametrosCorreoOtp {
  destinatario: string;
  nombrePaciente: string;
  codigoOtp: string;
  minutosValidez?: number;
  nombreEntidad?: string;
  logoUrl?: string;
  colorPrimario?: string;
  colorSecundario?: string;
}

@Injectable()
export class CorreoService {
  private readonly logger = new Logger(CorreoService.name);
  private transporter: nodemailer.Transporter | null = null;

  constructor(private readonly configService: ConfigService) {
    this.inicializarTransporter();
  }

  private inicializarTransporter() {
    const host =
      this.configService.get<string>('MAIL_HOST') ||
      this.configService.get<string>('SMTP_HOST');
    const port = Number(
      this.configService.get<number>('MAIL_PORT') ||
      this.configService.get<number>('SMTP_PORT', 587),
    );
    const user =
      this.configService.get<string>('MAIL_USERNAME') ||
      this.configService.get<string>('SMTP_USER');
    const pass =
      this.configService.get<string>('MAIL_PASSWORD') ||
      this.configService.get<string>('SMTP_PASS');
    const encryption =
      this.configService.get<string>('MAIL_ENCRYPTION') ||
      (this.configService.get<string>('SMTP_SECURE') === 'true' ? 'ssl' : 'tls');

    const secure = port === 465 || encryption === 'ssl';

    if (user && pass && host) {
      this.transporter = nodemailer.createTransport({
        host,
        port,
        secure,
        auth: {
          user,
          pass,
        },
        tls: {
          rejectUnauthorized: false,
        },
      });
      this.logger.log(`Servicio de correo configurado exitosamente con: ${host}:${port}`);
    } else {
      this.logger.warn(
        'Servicio de correo iniciado en modo desarrollo (sin credenciales SMTP). Los códigos OTP se imprimirán en consola.',
      );
    }
  }

  async enviarCodigoOtp(parametros: ParametrosCorreoOtp): Promise<boolean> {
    const {
      destinatario,
      nombrePaciente,
      codigoOtp,
      minutosValidez = 10,
      nombreEntidad = 'Portal Paciente',
      logoUrl = '',
      colorPrimario = '#075c39',
      colorSecundario = '#9cc516',
    } = parametros;

    const asunto = `${codigoOtp} es tu clave dinámica de acceso - ${nombreEntidad}`;
    const cuerpoHtml = this.generarPlantillaOtp({
      nombrePaciente,
      codigoOtp,
      minutosValidez,
      nombreEntidad,
      logoUrl,
      colorPrimario,
      colorSecundario,
    });

    const fromAddress =
      this.configService.get<string>('MAIL_FROM_ADDRESS') ||
      this.configService.get<string>('SMTP_FROM');
    const fromName =
      this.configService.get<string>('MAIL_FROM_NAME') ||
      nombreEntidad;

    const remitente = fromAddress
      ? `"${fromName}" <${fromAddress}>`
      : `"${nombreEntidad}" <notificaciones@portalpaciente.com>`;

    const correoOverride =
      this.configService.get<string>('MAIL_OVERRIDE_DESTINATARIO');
    const destinatarioFinal = correoOverride || destinatario;

    // Log para depuración y pruebas locales
    this.logger.log(
      `🔑 [OTP GENERADO] Para: ${destinatarioFinal} (Original: ${destinatario}) | Paciente: ${nombrePaciente} | Código: ${codigoOtp} | Tenant: ${nombreEntidad}`,
    );

    if (!this.transporter) {
      this.logger.log(
        `✉️ [MODO SIMULADO] Correo simulado exitosamente a ${destinatarioFinal} con código OTP: ${codigoOtp}`,
      );
      return true;
    }

    try {
      await this.transporter.sendMail({
        from: remitente,
        to: destinatarioFinal,
        subject: asunto,
        html: cuerpoHtml,
      });
      this.logger.log(`✅ Correo de autenticación OTP enviado exitosamente a ${destinatarioFinal}`);
      return true;
    } catch (error: any) {
      this.logger.error(
        `❌ Error al enviar correo OTP a ${destinatarioFinal}: ${error.message}`,
        error.stack,
      );
      return false;
    }
  }

  private generarPlantillaOtp(datos: {
    nombrePaciente: string;
    codigoOtp: string;
    minutosValidez: number;
    nombreEntidad: string;
    logoUrl?: string;
    colorPrimario: string;
    colorSecundario: string;
  }): string {
    const digitos = datos.codigoOtp.split('');
    const digitosHtml = digitos
      .map(
        (d) => `
        <td align="center" style="padding: 0 6px;">
          <div style="width: 52px; height: 60px; line-height: 60px; font-size: 32px; font-weight: 800; font-family: 'Segoe UI', Helvetica, Arial, sans-serif; color: #1e293b; background-color: #ffffff; border: 2px solid ${datos.colorPrimario}; border-radius: 12px; text-align: center; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.08);">
            ${d}
          </div>
        </td>
      `,
      )
      .join('');

    const logoHtml = datos.logoUrl
      ? `<img src="${datos.logoUrl}" alt="${datos.nombreEntidad}" style="max-height: 55px; max-width: 180px; object-fit: contain; margin-bottom: 8px;" />`
      : `<div style="font-size: 24px; font-weight: bold; color: ${datos.colorPrimario}; letter-spacing: -0.5px;">🏥 ${datos.nombreEntidad}</div>`;

    return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Clave Dinámica - ${datos.nombreEntidad}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #334155;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f1f5f9; padding: 40px 15px;">
    <tr>
      <td align="center">
        <!-- Tarjeta Principal -->
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 540px; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04); border: 1px solid #e2e8f0;">
          
          <!-- Franja Superior de Color Primario -->
          <tr>
            <td style="height: 6px; background: linear-gradient(90deg, ${datos.colorPrimario} 0%, ${datos.colorSecundario} 100%);"></td>
          </tr>

          <!-- Cabecera / Logo -->
          <tr>
            <td align="center" style="padding: 35px 30px 20px 30px; border-bottom: 1px solid #f1f5f9;">
              ${logoHtml}
              <div style="font-size: 13px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 1px; margin-top: 6px;">
                Portal del Paciente
              </div>
            </td>
          </tr>

          <!-- Contenido Principal -->
          <tr>
            <td style="padding: 32px 35px 25px 35px; text-align: center;">
              
              <div style="display: inline-block; width: 60px; height: 60px; line-height: 60px; border-radius: 50%; background-color: ${datos.colorPrimario}15; margin-bottom: 20px;">
                <span style="font-size: 28px;">🔐</span>
              </div>

              <h1 style="margin: 0 0 10px 0; font-size: 22px; font-weight: 700; color: #0f172a;">
                Clave Dinámica de Acceso
              </h1>
              
              <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.6; color: #475569;">
                Hola <strong>${datos.nombrePaciente || 'Estimado(a) Paciente'}</strong>, utiliza la siguiente clave de seguridad de 4 dígitos para ingresar a tu cuenta:
              </p>

              <!-- Caja de Código OTP de 4 Dígitos -->
              <div style="background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%); border-radius: 16px; padding: 24px 15px; margin-bottom: 24px; border: 1px solid #e2e8f0;">
                <table border="0" cellspacing="0" cellpadding="0" align="center">
                  <tr>
                    ${digitosHtml}
                  </tr>
                </table>

                <div style="margin-top: 18px;">
                  <span style="display: inline-block; padding: 5px 14px; border-radius: 20px; font-size: 12px; font-weight: 700; color: #92400e; background-color: #fef3c7; border: 1px solid #fde68a;">
                    ⏱️ LA CLAVE EXPIRA EN ${datos.minutosValidez} MINUTOS
                  </span>
                </div>
              </div>

              <!-- Mensaje de Seguridad -->
              <div style="background-color: #f8fafc; border-left: 4px solid ${datos.colorPrimario}; border-radius: 6px; padding: 12px 16px; text-align: left; margin-bottom: 20px;">
                <p style="margin: 0; font-size: 13px; line-height: 1.5; color: #475569;">
                  🛡️ <strong>Consejo de seguridad:</strong> Esta clave es personal e intransferible. Nunca te solicitaremos este código por teléfono ni llamada.
                </p>
              </div>

              <p style="margin: 0; font-size: 13px; color: #94a3b8; line-height: 1.5;">
                Si tú no solicitaste este código, puedes ignorar este mensaje de manera segura.
              </p>

            </td>
          </tr>

          <!-- Pie de Página -->
          <tr>
            <td style="padding: 24px 35px; background-color: #f8fafc; border-top: 1px solid #f1f5f9; text-align: center;">
              <p style="margin: 0 0 6px 0; font-size: 13px; font-weight: 600; color: #475569;">
                ${datos.nombreEntidad}
              </p>
              <p style="margin: 0; font-size: 11px; color: #94a3b8;">
                Mensaje generado automáticamente. Por favor no respondas a este correo.
              </p>
            </td>
          </tr>

        </table>

        <!-- Copyright -->
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 540px; margin-top: 20px;">
          <tr>
            <td align="center" style="font-size: 12px; color: #94a3b8;">
              © ${new Date().getFullYear()} ${datos.nombreEntidad}. Todos los derechos reservados.
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>
</body>
</html>
    `;
  }
}

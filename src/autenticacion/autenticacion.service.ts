import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  Inject,
  Scope,
  Logger,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import type { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { Usuario, RolUsuario } from './entities/usuario.entity';
import { CodigoOtp } from './entities/codigo-otp.entity';
import { Paciente, EstadoPaciente, GeneroPaciente } from '../pacientes/entities/paciente.entity';
import { IniciarSesionDto } from './dto/iniciar-sesion.dto';
import { RegistrarUsuarioDto } from './dto/registrar-usuario.dto';
import { ConfigService } from '@nestjs/config';
import { SolicitarOtpDto } from './dto/solicitar-otp.dto';
import { VerificarOtpDto } from './dto/verificar-otp.dto';
import { RespuestaApi } from '../common/interfaces/respuesta-api.interface';
import { CorreoService } from './services/correo.service';
import { IntegracionHospitalService } from './services/integracion-hospital.service';

@Injectable({ scope: Scope.REQUEST })
export class AutenticacionService {
  private readonly logger = new Logger(AutenticacionService.name);
  private readonly RONDAS_HASH = 10;
  private readonly MINUTOS_EXPIRACION_OTP = 10;
  private readonly MAX_INTENTOS_OTP = 3;

  constructor(
    @Inject(REQUEST) private readonly request: Request,
    private readonly servicioJwt: JwtService,
    private readonly correoService: CorreoService,
    private readonly hospitalService: IntegracionHospitalService,
    private readonly configService: ConfigService,
  ) {}

  private get repositorioUsuario() {
    return this.request.tenantConexion!.getRepository(Usuario);
  }

  private get repositorioOtp() {
    return this.request.tenantConexion!.getRepository(CodigoOtp);
  }

  private get repositorioPaciente() {
    return this.request.tenantConexion!.getRepository(Paciente);
  }

  /**
   * Solicita el código OTP de 4 dígitos para un paciente
   * 1. Consulta datos demográficos al servicio hospitalario/SAP
   * 2. Genera código de 4 dígitos criptográficamente seguro
   * 3. Guarda el registro de OTP con TTL de 10 min y límite de intentos
   * 4. Envía correo corporativo personalizado con branding del tenant
   */
  async solicitarOtp(
    solicitarOtpDto: SolicitarOtpDto,
  ): Promise<RespuestaApi<{ correoDestino?: string; correoEnmascarado: string; telefonoEnmascarado: string | null; expiraEn: Date }>> {
    const { tipoDocumento, numeroDocumento, fechaNacimiento } = solicitarOtpDto;
    const numeroDocLimpio = String(numeroDocumento).trim();

    let datosDemograficos: any = null;

    // 1. Consultar el servicio de integración hospitalario SAP PO
    try {
      datosDemograficos = await this.hospitalService.consultarDatosDemograficos({
        tipoDocumento,
        numeroDocumento,
        fechaNacimiento,
      });
    } catch (errApi: any) {
      this.logger.warn(
        `⚠️ Error al consultar SAP PO para doc ${numeroDocLimpio}: ${errApi.message}. Intentando localización en BD local...`,
      );

      // Fallback: Si el paciente ya existe en nuestra base de datos local
      const pacienteLocal = await this.repositorioPaciente.findOne({
        where: { numeroDocumento: numeroDocLimpio },
      });

      if (pacienteLocal) {
        // Validar fecha de nacimiento si está especificada
        if (fechaNacimiento && pacienteLocal.fechaNacimiento) {
          const fechaIngresadaNorm = this.hospitalService.normalizarFecha(fechaNacimiento);
          const fechaBdNorm = this.hospitalService.normalizarFecha(
            pacienteLocal.fechaNacimiento.toISOString().slice(0, 10),
          );

          if (fechaIngresadaNorm && fechaBdNorm && fechaIngresadaNorm !== fechaBdNorm) {
            throw new BadRequestException(
              'La fecha de nacimiento ingresada no coincide con la registrada para este documento.',
            );
          }
        }

        datosDemograficos = {
          numeroPaciente: pacienteLocal.id,
          nombres: pacienteLocal.nombres,
          apellidos: pacienteLocal.apellidos,
          nombreCompleto: `${pacienteLocal.nombres} ${pacienteLocal.apellidos}`.trim(),
          tipoDocumento: pacienteLocal.tipoDocumento,
          numeroDocumento: pacienteLocal.numeroDocumento,
          fechaNacimiento: pacienteLocal.fechaNacimiento
            ? pacienteLocal.fechaNacimiento.toISOString().slice(0, 10)
            : fechaNacimiento,
          correoElectronico: pacienteLocal.correoElectronico,
          telefono: pacienteLocal.telefono,
          direccion: pacienteLocal.direccion,
          ciudad: pacienteLocal.ciudad,
          genero: pacienteLocal.genero,
        };
        this.logger.log(`✅ Paciente localizado en BD local para generación de OTP: ${pacienteLocal.correoElectronico}`);
      } else {
        throw errApi;
      }
    }

    if (!datosDemograficos || !datosDemograficos.correoElectronico) {
      throw new BadRequestException(
        'No se encontraron datos registrados que coincidan con la información ingresada. Por favor verifica tu documento y fecha de nacimiento.',
      );
    }

    const correoOverride = this.configService.get<string>('MAIL_OVERRIDE_DESTINATARIO');
    const correoFinal = correoOverride || datosDemograficos.correoElectronico;

    // 2. Generar código de 4 dígitos
    const codigoOtp = crypto.randomInt(1000, 10000).toString();
    const expiraEn = new Date(Date.now() + this.MINUTOS_EXPIRACION_OTP * 60 * 1000);

    // 3. Invalidar códigos previos no utilizados para este documento
    await this.repositorioOtp.update(
      { tipoDocumento, numeroDocumento, usado: false },
      { usado: true },
    );

    // 4. Guardar nuevo registro de OTP en la base de datos del tenant
    const nuevoOtp = this.repositorioOtp.create({
      tipoDocumento,
      numeroDocumento,
      codigo: codigoOtp,
      correo: correoFinal,
      telefono: datosDemograficos.telefono || null,
      datosPaciente: datosDemograficos,
      intentos: 0,
      maxIntentos: this.MAX_INTENTOS_OTP,
      expiraEn,
      usado: false,
    });
    await this.repositorioOtp.save(nuevoOtp);

    // 5. Extraer configuración de branding del tenant actual
    const tenant = (this.request as any).tenant;
    const nombreEntidad = tenant?.nombreEntidad || 'Portal Paciente';
    const logoUrl = tenant?.logoUrl || '';
    const colorPrimario = tenant?.colorPrimario || '#075c39';
    const colorSecundario = tenant?.colorSecundario || '#9cc516';

    // 6. Enviar correo corporativo
    const nombreCompleto = `${datosDemograficos.nombres} ${datosDemograficos.apellidos}`.trim();
    await this.correoService.enviarCodigoOtp({
      destinatario: correoFinal,
      nombrePaciente: nombreCompleto,
      codigoOtp,
      minutosValidez: this.MINUTOS_EXPIRACION_OTP,
      nombreEntidad,
      logoUrl,
      colorPrimario,
      colorSecundario,
    });

    const correoEnmascarado = this.enmascararCorreo(correoFinal);
    const telefonoEnmascarado = datosDemograficos.telefono
      ? this.enmascararTelefono(datosDemograficos.telefono)
      : null;

    return {
      exito: true,
      mensaje: `Se ha enviado una clave dinámica de 4 dígitos a ${correoFinal}`,
      datos: {
        correoDestino: correoFinal,
        correoEnmascarado,
        telefonoEnmascarado,
        expiraEn,
      },
    };
  }

  /**
   * Verifica el código OTP de 4 dígitos ingresado por el paciente o administrador
   * 1. Valida expiración, intentos y concordancia
   * 2. Sincroniza al paciente en la base de datos
   * 3. Sincroniza o crea el usuario correspondiente con su respectivo rol
   * 4. Emite el token JWT de sesión
   */
  async verificarOtp(
    verificarOtpDto: VerificarOtpDto,
  ): Promise<RespuestaApi<{ token: string; usuario: Omit<Usuario, 'contrasena'>; paciente: Paciente }>> {
    const { tipoDocumento, numeroDocumento, codigoOtp } = verificarOtpDto;

    const registroOtp = await this.repositorioOtp.findOne({
      where: { tipoDocumento, numeroDocumento, usado: false },
      order: { creadoEn: 'DESC' },
    });

    if (!registroOtp) {
      throw new UnauthorizedException(
        'No hay un código OTP activo para este documento. Por favor solicita uno nuevo.',
      );
    }

    // Verificar si expiró
    if (new Date() > new Date(registroOtp.expiraEn)) {
      registroOtp.usado = true;
      await this.repositorioOtp.save(registroOtp);
      throw new UnauthorizedException(
        'La clave dinámica ha expirado. Por favor solicita una nueva.',
      );
    }

    // Verificar si superó intentos
    if (registroOtp.intentos >= registroOtp.maxIntentos) {
      registroOtp.usado = true;
      await this.repositorioOtp.save(registroOtp);
      throw new UnauthorizedException(
        'Has superado el número máximo de intentos permitidos. Por favor solicita un nuevo código.',
      );
    }

    // Verificar coincidencia de código
    if (registroOtp.codigo !== codigoOtp) {
      registroOtp.intentos += 1;
      const intentosRestantes = registroOtp.maxIntentos - registroOtp.intentos;
      if (intentosRestantes <= 0) {
        registroOtp.usado = true;
      }
      await this.repositorioOtp.save(registroOtp);

      if (intentosRestantes <= 0) {
        throw new UnauthorizedException(
          'Código dinámico incorrecto. Has agotado tus intentos, solicita una nueva clave.',
        );
      }

      throw new UnauthorizedException(
        `Código dinámico incorrecto. Te quedan ${intentosRestantes} intento(s).`,
      );
    }

    // Marcar OTP como utilizado
    registroOtp.usado = true;
    await this.repositorioOtp.save(registroOtp);

    // Sincronizar Paciente en BD
    const datosDemograficos = registroOtp.datosPaciente || {};
    let paciente = await this.repositorioPaciente.findOne({
      where: { numeroDocumento },
    });

    if (!paciente) {
      let generoParsed = GeneroPaciente.OTRO;
      if (datosDemograficos.genero === 'masculino' || datosDemograficos.genero === 'M' || datosDemograficos.genero === 'FEMENINO') {
        generoParsed = datosDemograficos.genero === 'FEMENINO' ? GeneroPaciente.FEMENINO : GeneroPaciente.MASCULINO;
      }

      paciente = this.repositorioPaciente.create({
        nombres: datosDemograficos.nombres || 'Paciente',
        apellidos: datosDemograficos.apellidos || '',
        tipoDocumento,
        numeroDocumento,
        fechaNacimiento: datosDemograficos.fechaNacimiento
          ? new Date(datosDemograficos.fechaNacimiento)
          : new Date('1990-01-01'),
        correoElectronico: registroOtp.correo,
        telefono: registroOtp.telefono || undefined,
        direccion: datosDemograficos.direccion || undefined,
        ciudad: datosDemograficos.ciudad || undefined,
        genero: generoParsed,
        estado: EstadoPaciente.ACTIVO,
      });
      paciente = await this.repositorioPaciente.save(paciente);
    } else {
      // Actualizar datos con la información
      if (datosDemograficos.nombres) paciente.nombres = datosDemograficos.nombres;
      if (datosDemograficos.apellidos !== undefined) paciente.apellidos = datosDemograficos.apellidos;
      if (datosDemograficos.direccion) paciente.direccion = datosDemograficos.direccion;
      if (datosDemograficos.ciudad) paciente.ciudad = datosDemograficos.ciudad;
      if (datosDemograficos.telefono) paciente.telefono = datosDemograficos.telefono;
      if (registroOtp.correo) paciente.correoElectronico = registroOtp.correo;
      paciente = await this.repositorioPaciente.save(paciente);
    }

    // Sincronizar o crear usuario en BD.
    // El acceso vía OTP siempre corresponde al rol PACIENTE; los roles de personal
    // (ADMINISTRADOR, MEDICO, RECEPCIONISTA) se otorgan por gestión administrativa,
    // nunca automáticamente a partir de un documento o correo en el flujo de OTP.
    let usuario = await this.repositorioUsuario.findOne({
      where: { correoElectronico: registroOtp.correo },
    });

    if (!usuario) {
      const contrasenaGenerica = await bcrypt.hash(crypto.randomUUID(), this.RONDAS_HASH);
      usuario = this.repositorioUsuario.create({
        nombres: paciente.nombres,
        apellidos: paciente.apellidos,
        correoElectronico: registroOtp.correo,
        contrasena: contrasenaGenerica,
        rol: RolUsuario.PACIENTE,
        activo: true,
      });
      usuario = await this.repositorioUsuario.save(usuario);
    } else {
      usuario.nombres = paciente.nombres;
      usuario.apellidos = paciente.apellidos;
      usuario = await this.repositorioUsuario.save(usuario);
    }

    // Generar JWT
    const cargaJwt = {
      sub: usuario.id,
      correoElectronico: usuario.correoElectronico,
      rol: usuario.rol,
      nombres: usuario.nombres,
      apellidos: usuario.apellidos,
      pacienteId: paciente.id,
      tipoDocumento: paciente.tipoDocumento,
      numeroDocumento: paciente.numeroDocumento,
    };

    const token = await this.servicioJwt.signAsync(cargaJwt);
    const { contrasena: _contrasena, ...usuarioSinContrasena } = usuario;

    return {
      exito: true,
      mensaje: 'Autenticación exitosa',
      datos: {
        token,
        usuario: usuarioSinContrasena as Omit<Usuario, 'contrasena'>,
        paciente,
      },
    };
  }

  async registrarUsuario(
    registrarUsuarioDto: RegistrarUsuarioDto,
  ): Promise<RespuestaApi<Omit<Usuario, 'contrasena'>>> {
    const usuarioExistente = await this.repositorioUsuario.findOne({
      where: { correoElectronico: registrarUsuarioDto.correoElectronico },
    });

    if (usuarioExistente) {
      throw new ConflictException(
        `Ya existe un usuario con el correo ${registrarUsuarioDto.correoElectronico}`,
      );
    }

    const contrasenaHasheada = await bcrypt.hash(
      registrarUsuarioDto.contrasena,
      this.RONDAS_HASH,
    );

    const nuevoUsuario = this.repositorioUsuario.create({
      ...registrarUsuarioDto,
      contrasena: contrasenaHasheada,
      rol: RolUsuario.PACIENTE,
    });

    const usuarioGuardado = await this.repositorioUsuario.save(nuevoUsuario);
    const { contrasena: _contrasena, ...usuarioSinContrasena } = usuarioGuardado;

    return {
      exito: true,
      mensaje: 'Usuario registrado exitosamente',
      datos: usuarioSinContrasena as Omit<Usuario, 'contrasena'>,
    };
  }

  async iniciarSesion(
    iniciarSesionDto: IniciarSesionDto,
  ): Promise<RespuestaApi<{ token: string; usuario: Omit<Usuario, 'contrasena'> }>> {
    const usuario = await this.repositorioUsuario.findOne({
      where: { correoElectronico: iniciarSesionDto.correoElectronico, activo: true },
    });

    if (!usuario) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    const contrasenaValida = await bcrypt.compare(
      iniciarSesionDto.contrasena,
      usuario.contrasena,
    );

    if (!contrasenaValida) {
      throw new UnauthorizedException('Credenciales incorrectas');
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
        usuario: usuarioSinContrasena as Omit<Usuario, 'contrasena'>,
      },
    };
  }

  async obtenerPerfilUsuario(usuario: Usuario): Promise<RespuestaApi<Omit<Usuario, 'contrasena'>>> {
    const { contrasena: _contrasena, ...perfilUsuario } = usuario;

    return {
      exito: true,
      mensaje: 'Perfil del usuario obtenido exitosamente',
      datos: perfilUsuario as Omit<Usuario, 'contrasena'>,
    };
  }

  private enmascararCorreo(correo: string): string {
    const partes = correo.split('@');
    if (partes.length !== 2) return correo;
    const [nombre, dominio] = partes;
    if (nombre.length <= 2) {
      return `${nombre[0]}*@${dominio}`;
    }
    const visibleInicio = nombre.slice(0, 2);
    const visibleFin = nombre.slice(-1);
    const asteriscos = '*'.repeat(Math.max(2, nombre.length - 3));
    return `${visibleInicio}${asteriscos}${visibleFin}@${dominio}`;
  }

  private enmascararTelefono(telefono: string): string {
    const limpio = telefono.replace(/\D/g, '');
    if (limpio.length <= 4) return telefono;
    const ultimosCuatro = limpio.slice(-4);
    return `*** *** ${ultimosCuatro}`;
  }
}

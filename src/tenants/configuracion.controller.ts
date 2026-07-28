import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { TenantService } from './tenant.service';
import { GuardJwtAutenticacion } from '../common/guards/jwt-autenticacion.guard';

@Controller('configuracion')
export class ConfiguracionController {
  constructor(private readonly tenantService: TenantService) {}

  /**
   * Obtener configuración pública del tenant actual.
   * No requiere token de autenticación.
   * GET /api/v1/configuracion
   */
  @Get()
  async obtenerConfiguracion(@Req() req: any) {
    // El tenant ya fue resuelto por TenantMiddleware
    const tenant = req.tenant;
    
    return {
      exito: true,
      mensaje: 'Configuración obtenida',
      datos: {
        nombreEntidad: tenant.nombreEntidad,
        logoUrl: tenant.logoUrl,
        colorPrimario: tenant.colorPrimario,
        colorSecundario: tenant.colorSecundario,
      },
    };
  }

  /**
   * Actualizar la configuración del tenant actual.
   * Protegido: Solo para el administrador de la clínica.
   * PATCH /api/v1/configuracion
   */
  @Patch()
  @UseGuards(GuardJwtAutenticacion)
  async actualizarConfiguracion(
    @Req() req: any,
    @Body() body: { nombreEntidad?: string; logoUrl?: string; colorPrimario?: string; colorSecundario?: string },
  ) {
    // Validar que sea admin del tenant (el GuardiaJwt ya verificó el token, validemos rol)
    const usuario = req.user;
    if (usuario.rol !== 'administrador') {
      return {
        exito: false,
        mensaje: 'Acceso denegado. Se requiere rol de administrador.',
      };
    }

    const tenant = req.tenant;
    
    const configuracionActualizada = await this.tenantService.actualizarBranding(tenant.id, body);

    return {
      exito: true,
      mensaje: 'Configuración actualizada exitosamente',
      datos: {
        nombreEntidad: configuracionActualizada.nombreEntidad,
        logoUrl: configuracionActualizada.logoUrl,
        colorPrimario: configuracionActualizada.colorPrimario,
        colorSecundario: configuracionActualizada.colorSecundario,
      },
    };
  }
}

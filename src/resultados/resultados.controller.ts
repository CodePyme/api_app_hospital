import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { GuardJwtAutenticacion } from '../common/guards/jwt-autenticacion.guard';
import { ResultadosService } from './resultados.service';

@Controller('resultados')
export class ResultadosController {
  constructor(private readonly resultadosService: ResultadosService) {}

  /**
   * GET /resultados
   * Obtiene la lista de órdenes de laboratorio para el paciente autenticado
   */
  @UseGuards(GuardJwtAutenticacion)
  @Get()
  async obtenerOrdenesLaboratorio(
    @Req() req: Request,
    @Query('pagina') pagina?: string,
    @Query('limite') limite?: string,
    @Query('clientCode') clientCode?: string,
  ) {
    return this.resultadosService.obtenerOrdenesLaboratorio(req.user, {
      pagina,
      limite,
      clientCode,
    });
  }

  /**
   * POST /resultados/detalle
   * Obtiene los estudios, analitos y ruta PDF para una orden específica
   */
  @UseGuards(GuardJwtAutenticacion)
  @Post('detalle')
  async obtenerDetalleOrden(
    @Body('internalNumber') internalNumber: string,
    @Body('clientCode') clientCode?: string,
  ) {
    return this.resultadosService.obtenerDetalleOrden(internalNumber, clientCode);
  }

  /**
   * GET /resultados/pdf
   * Proxy para visualizar/descargar el archivo PDF del resultado (acceso directo mediante urlKey seguro de Labcore)
   */
  @Get('pdf')
  async descargarPdf(@Query('url') pdfUrl: string, @Res() res: Response) {
    return this.resultadosService.proxyPdf(pdfUrl, res);
  }
}

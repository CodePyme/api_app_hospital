export declare class CodigoOtp {
    id: string;
    tipoDocumento: string;
    numeroDocumento: string;
    codigo: string;
    correo: string;
    telefono: string | null;
    datosPaciente: Record<string, any> | null;
    intentos: number;
    maxIntentos: number;
    expiraEn: Date;
    usado: boolean;
    creadoEn: Date;
    actualizadoEn: Date;
}

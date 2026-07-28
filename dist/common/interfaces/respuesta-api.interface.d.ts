export interface RespuestaApi<T> {
    exito: boolean;
    mensaje: string;
    datos?: T;
    errores?: string[];
}
export interface RespuestaPaginada<T> {
    exito: boolean;
    mensaje: string;
    datos: T[];
    total: number;
    pagina: number;
    limite: number;
    totalPaginas: number;
}

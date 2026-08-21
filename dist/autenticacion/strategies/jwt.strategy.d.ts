import { Strategy } from 'passport-jwt';
import { Request } from 'express';
interface CargaJwt {
    sub: string;
    correoElectronico: string;
    rol: string;
    nombres?: string;
    apellidos?: string;
    pacienteId?: string;
    tipoDocumento?: string;
    numeroDocumento?: string;
}
declare const EstrategiaJwt_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class EstrategiaJwt extends EstrategiaJwt_base {
    constructor();
    validate(req: Request, cargaJwt: CargaJwt): Promise<any>;
}
export {};

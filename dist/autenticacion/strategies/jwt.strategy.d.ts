import { Strategy } from 'passport-jwt';
import { Request } from 'express';
import { Usuario } from '../entities/usuario.entity';
interface CargaJwt {
    sub: string;
    correoElectronico: string;
    rol: string;
}
declare const EstrategiaJwt_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class EstrategiaJwt extends EstrategiaJwt_base {
    constructor();
    validate(req: Request, cargaJwt: CargaJwt): Promise<Usuario>;
}
export {};

import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
export declare class PermisosGuard implements CanActivate {
    private readonly reflector;
    private readonly CORREO_SUPER_ADMIN;
    constructor(reflector: Reflector);
    canActivate(context: ExecutionContext): boolean;
}

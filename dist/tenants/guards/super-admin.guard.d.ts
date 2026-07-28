import { CanActivate, ExecutionContext } from '@nestjs/common';
export declare class SuperAdminGuard implements CanActivate {
    private readonly CORREO_SUPER_ADMIN;
    canActivate(context: ExecutionContext): boolean;
}

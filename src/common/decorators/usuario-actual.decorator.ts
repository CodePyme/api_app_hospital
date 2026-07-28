import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UsuarioActual = createParamDecorator(
  (dato: string | undefined, contexto: ExecutionContext) => {
    const solicitud = contexto.switchToHttp().getRequest();
    const usuario = solicitud.user;

    return dato ? usuario?.[dato] : usuario;
  },
);

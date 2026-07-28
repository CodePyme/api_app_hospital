import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GuardJwtAutenticacion extends AuthGuard('jwt') {}

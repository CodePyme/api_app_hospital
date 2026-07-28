import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AutenticacionController } from './autenticacion.controller';
import { AutenticacionService } from './autenticacion.service';
import { EstrategiaJwt } from './strategies/jwt.strategy';
import { Usuario } from './entities/usuario.entity';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configuracionServicio: ConfigService) => ({
        secret: configuracionServicio.get<string>('JWT_SECRETO'),
        signOptions: {
          expiresIn: (configuracionServicio.get<string>('JWT_EXPIRACION') || '1d') as any,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AutenticacionController],
  providers: [AutenticacionService, EstrategiaJwt],
  exports: [AutenticacionService, JwtModule, PassportModule],
})
export class AutenticacionModule {}

import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class VerificarOtpDto {
  @IsNotEmpty({ message: 'El tipo de documento es requerido' })
  @IsString({ message: 'El tipo de documento debe ser una cadena de texto' })
  tipoDocumento: string;

  @IsNotEmpty({ message: 'El número de documento es requerido' })
  @IsString({ message: 'El número de documento debe ser una cadena de texto' })
  numeroDocumento: string;

  @IsNotEmpty({ message: 'El código OTP es requerido' })
  @IsString({ message: 'El código OTP debe ser numérico' })
  @Length(4, 4, { message: 'El código debe tener exactamente 4 dígitos' })
  @Matches(/^[0-9]{4}$/, { message: 'El código debe contener solo números' })
  codigoOtp: string;
}

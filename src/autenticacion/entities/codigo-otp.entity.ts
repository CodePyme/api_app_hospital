import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'codigos_otp' })
export class CodigoOtp {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ name: 'tipo_documento', type: 'varchar', length: 30 })
  tipoDocumento: string;

  @Index()
  @Column({ name: 'numero_documento', type: 'varchar', length: 50 })
  numeroDocumento: string;

  @Column({ name: 'codigo', type: 'varchar', length: 10 })
  codigo: string;

  @Column({ name: 'correo', type: 'varchar', length: 150 })
  correo: string;

  @Column({ name: 'telefono', type: 'varchar', length: 30, nullable: true })
  telefono: string | null;

  @Column({ name: 'datos_paciente', type: 'jsonb', nullable: true })
  datosPaciente: Record<string, any> | null;

  @Column({ name: 'intentos', type: 'int', default: 0 })
  intentos: number;

  @Column({ name: 'max_intentos', type: 'int', default: 3 })
  maxIntentos: number;

  @Column({ name: 'expira_en', type: 'timestamp with time zone' })
  expiraEn: Date;

  @Column({ name: 'usado', type: 'boolean', default: false })
  usado: boolean;

  @CreateDateColumn({ name: 'creado_en' })
  creadoEn: Date;

  @UpdateDateColumn({ name: 'actualizado_en' })
  actualizadoEn: Date;
}

import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'auditoria_cancelaciones_citas' })
export class AuditoriaCancelacionCita {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'id_cita', type: 'varchar', length: 30 })
  idCita: string;

  @Column({ name: 'paciente_id', type: 'uuid', nullable: true })
  pacienteId?: string;

  @Column({ name: 'usuario_id', type: 'uuid', nullable: true })
  usuarioId?: string;

  @Column({ name: 'numero_documento', type: 'varchar', length: 30 })
  numeroDocumento: string;

  @Column({ name: 'tipo_documento', type: 'varchar', length: 30, default: 'CC' })
  tipoDocumento: string;

  @Column({ name: 'nombre_paciente', type: 'varchar', length: 150, nullable: true })
  nombrePaciente?: string;

  @Column({ name: 'id_motivo', type: 'varchar', length: 10 })
  idMotivo: string;

  @Column({ name: 'descripcion_motivo', type: 'varchar', length: 150 })
  descripcionMotivo: string;

  @Column({ name: 'observaciones', type: 'text', nullable: true })
  observaciones?: string;

  @Column({ name: 'limite_horas', type: 'int', default: 24 })
  limiteHoras: number;

  @Column({ name: 'codigo_respuesta_sap', type: 'varchar', length: 10, nullable: true })
  codigoRespuestaSap?: string;

  @Column({ name: 'mensaje_respuesta_sap', type: 'varchar', length: 255, nullable: true })
  mensajeRespuestaSap?: string;

  @Column({ name: 'exitosa', type: 'boolean', default: false })
  exitosa: boolean;

  @Column({ name: 'ip_usuario', type: 'varchar', length: 100, nullable: true })
  ipUsuario?: string;

  @Column({ name: 'user_agent', type: 'varchar', length: 255, nullable: true })
  userAgent?: string;

  @Column({ name: 'datos_cita', type: 'jsonb', nullable: true })
  datosCita?: Record<string, any>;

  @CreateDateColumn({ name: 'creado_en', type: 'timestamp with time zone' })
  creadoEn: Date;
}

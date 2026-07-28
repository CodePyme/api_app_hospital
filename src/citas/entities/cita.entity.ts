import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Paciente } from '../../pacientes/entities/paciente.entity';

export enum EstadoCita {
  PROGRAMADA = 'programada',
  CONFIRMADA = 'confirmada',
  EN_ATENCION = 'en_atencion',
  COMPLETADA = 'completada',
  CANCELADA = 'cancelada',
  NO_ASISTIO = 'no_asistio',
}

export enum TipoCita {
  CONSULTA_GENERAL = 'consulta_general',
  ESPECIALISTA = 'especialista',
  URGENCIAS = 'urgencias',
  CONTROL = 'control',
  PROCEDIMIENTO = 'procedimiento',
}

@Entity({ name: 'citas' })
export class Cita {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'paciente_id', type: 'uuid' })
  pacienteId: string;

  @ManyToOne(() => Paciente, (paciente) => paciente.citas, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'paciente_id' })
  paciente: Paciente;

  @Column({ name: 'fecha_cita', type: 'date' })
  fechaCita: Date;

  @Column({ name: 'hora_inicio', type: 'time' })
  horaInicio: string;

  @Column({ name: 'hora_fin', type: 'time' })
  horaFin: string;

  @Column({ name: 'tipo_cita', type: 'enum', enum: TipoCita, default: TipoCita.CONSULTA_GENERAL })
  tipoCita: TipoCita;

  @Column({ name: 'estado', type: 'enum', enum: EstadoCita, default: EstadoCita.PROGRAMADA })
  estado: EstadoCita;

  @Column({ name: 'medico_responsable', type: 'varchar', length: 150, nullable: true })
  medicoResponsable: string;

  @Column({ name: 'especialidad', type: 'varchar', length: 100, nullable: true })
  especialidad: string;

  @Column({ name: 'consultorio', type: 'varchar', length: 50, nullable: true })
  consultorio: string;

  @Column({ name: 'motivo_consulta', type: 'text', nullable: true })
  motivoConsulta: string;

  @Column({ name: 'observaciones', type: 'text', nullable: true })
  observaciones: string;

  @CreateDateColumn({ name: 'creado_en' })
  creadoEn: Date;

  @UpdateDateColumn({ name: 'actualizado_en' })
  actualizadoEn: Date;
}

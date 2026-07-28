import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Cita } from '../../citas/entities/cita.entity';

export enum GeneroPaciente {
  MASCULINO = 'masculino',
  FEMENINO = 'femenino',
  OTRO = 'otro',
}

export enum EstadoPaciente {
  ACTIVO = 'activo',
  INACTIVO = 'inactivo',
}

@Entity({ name: 'pacientes' })
export class Paciente {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'nombres', type: 'varchar', length: 100 })
  nombres: string;

  @Column({ name: 'apellidos', type: 'varchar', length: 100 })
  apellidos: string;

  @Column({ name: 'numero_documento', type: 'varchar', length: 20, unique: true })
  numeroDocumento: string;

  @Column({ name: 'tipo_documento', type: 'varchar', length: 30, default: 'cedula' })
  tipoDocumento: string;

  @Column({ name: 'fecha_nacimiento', type: 'date' })
  fechaNacimiento: Date;

  @Column({ name: 'genero', type: 'enum', enum: GeneroPaciente, default: GeneroPaciente.OTRO })
  genero: GeneroPaciente;

  @Column({ name: 'correo_electronico', type: 'varchar', length: 150, unique: true, nullable: true })
  correoElectronico: string;

  @Column({ name: 'telefono', type: 'varchar', length: 20, nullable: true })
  telefono: string;

  @Column({ name: 'direccion', type: 'text', nullable: true })
  direccion: string;

  @Column({ name: 'ciudad', type: 'varchar', length: 100, nullable: true })
  ciudad: string;

  @Column({ name: 'estado', type: 'enum', enum: EstadoPaciente, default: EstadoPaciente.ACTIVO })
  estado: EstadoPaciente;

  @Column({ name: 'observaciones', type: 'text', nullable: true })
  observaciones: string;

  @CreateDateColumn({ name: 'creado_en' })
  creadoEn: Date;

  @UpdateDateColumn({ name: 'actualizado_en' })
  actualizadoEn: Date;

  @OneToMany(() => Cita, (cita) => cita.paciente)
  citas: Cita[];
}

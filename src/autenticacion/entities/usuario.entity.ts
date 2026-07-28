import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum RolUsuario {
  ADMINISTRADOR = 'administrador',
  MEDICO = 'medico',
  RECEPCIONISTA = 'recepcionista',
  PACIENTE = 'paciente',
}

@Entity({ name: 'usuarios' })
export class Usuario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'nombres', type: 'varchar', length: 100 })
  nombres: string;

  @Column({ name: 'apellidos', type: 'varchar', length: 100 })
  apellidos: string;

  @Column({ name: 'correo_electronico', type: 'varchar', length: 150, unique: true })
  correoElectronico: string;

  @Column({ name: 'contrasena', type: 'varchar', length: 255 })
  contrasena: string;

  @Column({ name: 'rol', type: 'enum', enum: RolUsuario, default: RolUsuario.RECEPCIONISTA })
  rol: RolUsuario;

  @Column({ name: 'activo', type: 'boolean', default: true })
  activo: boolean;

  @CreateDateColumn({ name: 'creado_en' })
  creadoEn: Date;

  @UpdateDateColumn({ name: 'actualizado_en' })
  actualizadoEn: Date;
}

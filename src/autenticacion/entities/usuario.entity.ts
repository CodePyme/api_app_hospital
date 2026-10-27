import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Rol } from '../../roles/entities/rol.entity';
import { Permiso } from '../../permisos/entities/permiso.entity';

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

  @Column({ name: 'rol', type: 'enum', enum: RolUsuario, default: RolUsuario.PACIENTE })
  rol: RolUsuario;

  @Column({ name: 'rol_id', type: 'uuid', nullable: true })
  rolId?: string | null;

  @ManyToOne(() => Rol, (r) => r.usuarios, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'rol_id' })
  rolEntidad?: Rol | null;

  @ManyToMany(() => Permiso, (p) => p.usuarios, { cascade: false })
  @JoinTable({
    name: 'usuarios_permisos',
    joinColumn: { name: 'usuario_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'permiso_id', referencedColumnName: 'id' },
  })
  permisosDirectos?: Permiso[];

  @Column({ name: 'activo', type: 'boolean', default: true })
  activo: boolean;

  @CreateDateColumn({ name: 'creado_en' })
  creadoEn: Date;

  @UpdateDateColumn({ name: 'actualizado_en' })
  actualizadoEn: Date;
}

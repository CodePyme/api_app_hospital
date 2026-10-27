import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Rol } from '../../roles/entities/rol.entity';
import { Usuario } from '../../autenticacion/entities/usuario.entity';

@Entity({ name: 'permisos' })
export class Permiso {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'codigo', type: 'varchar', length: 100, unique: true })
  codigo: string;

  @Column({ name: 'nombre', type: 'varchar', length: 100 })
  nombre: string;

  @Column({ name: 'descripcion', type: 'varchar', length: 255, nullable: true })
  descripcion: string;

  @Column({ name: 'modulo', type: 'varchar', length: 50 })
  modulo: string;

  @Column({ name: 'activo', type: 'boolean', default: true })
  activo: boolean;

  @ManyToMany(() => Rol, (rol) => rol.permisos)
  roles: Rol[];

  @ManyToMany(() => Usuario, (usuario) => usuario.permisosDirectos)
  usuarios: Usuario[];

  @CreateDateColumn({ name: 'creado_en' })
  creadoEn: Date;

  @UpdateDateColumn({ name: 'actualizado_en' })
  actualizadoEn: Date;
}

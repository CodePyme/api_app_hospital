import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'tenants' })
export class Tenant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'nombre', type: 'varchar', length: 100 })
  nombre: string;

  @Column({ name: 'dominio', type: 'varchar', length: 255, unique: true })
  dominio: string;

  @Column({ name: 'slug', type: 'varchar', length: 100, unique: true })
  slug: string;

  @Column({ name: 'db_host', type: 'varchar', length: 255, default: '127.0.0.1' })
  dbHost: string;

  @Column({ name: 'db_port', type: 'int', default: 5432 })
  dbPort: number;

  @Column({ name: 'db_username', type: 'varchar', length: 100 })
  dbUsername: string;

  @Column({ name: 'db_password', type: 'varchar', length: 255 })
  dbPassword: string;

  @Column({ name: 'db_database', type: 'varchar', length: 100 })
  dbDatabase: string;

  @Column({ name: 'activo', type: 'boolean', default: true })
  activo: boolean;

  @Column({ name: 'nombre_entidad', type: 'varchar', length: 150, default: 'Salud Plus' })
  nombreEntidad: string;

  @Column({ name: 'logo_url', type: 'varchar', length: 500, nullable: true })
  logoUrl: string;

  @Column({ name: 'color_primario', type: 'varchar', length: 20, default: '#075c39' })
  colorPrimario: string;

  @Column({ name: 'color_secundario', type: 'varchar', length: 20, default: '#9cc516' })
  colorSecundario: string;

  @CreateDateColumn({ name: 'creado_en' })
  creadoEn: Date;

  @UpdateDateColumn({ name: 'actualizado_en' })
  actualizadoEn: Date;
}

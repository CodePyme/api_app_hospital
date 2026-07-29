-- =============================================
-- SCRIPT DE BASE DE DATOS MAESTRA MULTI-TENANT
-- Base de datos: portal_paciente
-- =============================================
-- NOTA: Este script es solo de referencia/documentación.
-- La aplicación crea y sincroniza las tablas automáticamente
-- via TypeORM (synchronize: true) + SeederMaestro al arrancar.
-- =============================================

-- Crear la base de datos maestra (solo si se hace setup manual)
-- CREATE DATABASE portal_paciente;

-- Conectarse a portal_paciente y ejecutar:

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabla de tenants
CREATE TABLE IF NOT EXISTS tenants (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre           VARCHAR(100)  NOT NULL,
  dominio          VARCHAR(255)  NOT NULL UNIQUE,
  slug             VARCHAR(100)  NOT NULL UNIQUE,
  db_host          VARCHAR(255)  NOT NULL DEFAULT '127.0.0.1',
  db_port          INT           NOT NULL DEFAULT 5432,
  db_username      VARCHAR(100)  NOT NULL,
  db_password      VARCHAR(255)  NOT NULL,
  db_database      VARCHAR(100)  NOT NULL,
  activo           BOOLEAN       NOT NULL DEFAULT true,
  nombre_entidad   VARCHAR(150)  NOT NULL DEFAULT 'Salud Plus',
  logo_url         VARCHAR(500)  NULL,
  color_primario   VARCHAR(20)   NOT NULL DEFAULT '#075c39',
  color_secundario VARCHAR(20)   NOT NULL DEFAULT '#9cc516',
  creado_en        TIMESTAMPTZ   NOT NULL DEFAULT now(),
  actualizado_en   TIMESTAMPTZ   NOT NULL DEFAULT now()
);

-- Índices para búsqueda rápida
CREATE INDEX IF NOT EXISTS idx_tenants_dominio ON tenants(dominio);
CREATE INDEX IF NOT EXISTS idx_tenants_activo  ON tenants(activo);

-- =============================================
-- TENANT DE DESARROLLO (localhost)
-- =============================================
-- NOTA: SeederMaestro lo inserta automáticamente al arrancar.
--       Este INSERT es solo para referencia o setup manual.
-- =============================================
-- INSERT INTO tenants (
--   nombre,
--   dominio,
--   slug,
--   db_host,
--   db_port,
--   db_username,
--   db_password,
--   db_database
-- ) VALUES (
--   'Clínica Local (Desarrollo)',
--   'localhost',
--   'localhost',
--   '127.0.0.1',
--   5432,
--   'admin',
--   'admin123',
--   'portal_paciente'
-- ) ON CONFLICT (dominio) DO NOTHING;

-- =============================================
-- EJEMPLO: Agregar un tenant de producción
-- =============================================
INSERT INTO tenants (
  nombre,
  dominio,
  slug,
  db_host,
  db_port,
  db_username,
  db_password,
  db_database
) VALUES (
  'Portal paciente Runasalud',
  'portal.runasalud.com',
  'runasalud',
  '64.227.12.37',
  5432,
  'forge',
  'CNbVNAEpljeeufpnFZEA',
  'portal_paciente'
);

-- Verificar tenants registrados
SELECT id, nombre, dominio, db_database, activo FROM tenants;

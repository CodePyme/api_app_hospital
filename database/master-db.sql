-- =============================================
-- SCRIPT DE BASE DE DATOS MAESTRA MULTI-TENANT
-- Base de datos: portal_paciente_master
-- =============================================

-- Crear la base de datos maestra (ejecutar conectado a postgres)
-- CREATE DATABASE portal_paciente_master;

-- Conectarse a portal_paciente_master y ejecutar:

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabla de tenants
CREATE TABLE IF NOT EXISTS tenants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre VARCHAR(100) NOT NULL,
  dominio VARCHAR(255) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  db_host VARCHAR(255) NOT NULL DEFAULT '127.0.0.1',
  db_port INT NOT NULL DEFAULT 5432,
  db_username VARCHAR(100) NOT NULL,
  db_password VARCHAR(255) NOT NULL,
  db_database VARCHAR(100) NOT NULL,
  activo BOOLEAN NOT NULL DEFAULT true,
  creado_en TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  actualizado_en TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Índice para búsqueda rápida por dominio
CREATE INDEX IF NOT EXISTS idx_tenants_dominio ON tenants(dominio);
CREATE INDEX IF NOT EXISTS idx_tenants_activo ON tenants(activo);

-- =============================================
-- TENANT DE DESARROLLO (localhost)
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
  'Clínica Local (Desarrollo)',
  'localhost',
  'localhost',
  '127.0.0.1',
  5432,
  'admin',
  'admin123',
  'portal_paciente'
) ON CONFLICT (dominio) DO NOTHING;

-- =============================================
-- EJEMPLO: Agregar un tenant de producción
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
--   'Clínica ABC',
--   'clinica-abc.com',
--   'clinica-abc',
--   '127.0.0.1',
--   5432,
--   'admin',
--   'password_seguro',
--   'portal_paciente_clinica_abc'
-- );

-- Verificar tenants registrados
SELECT id, nombre, dominio, db_database, activo FROM tenants;

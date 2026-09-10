-- ============================================
-- COMPLETE DATABASE SCHEMA
-- M&M Relojes - Database Structure
-- ============================================

-- Table: business_hours
CREATE TABLE IF NOT EXISTS business_hours (
  id SERIAL PRIMARY KEY,
  day_of_week VARCHAR(20) NOT NULL,
  is_open BOOLEAN DEFAULT true,
  open_time VARCHAR(10),
  close_time VARCHAR(10),
  additional_open_time VARCHAR(10),
  additional_close_time VARCHAR(10),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: business_hours_config
CREATE TABLE IF NOT EXISTS business_hours_config (
  id SERIAL PRIMARY KEY,
  allow_orders_when_closed BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: categorias
CREATE TABLE IF NOT EXISTS categorias (
  id VARCHAR(100) PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  imagen TEXT,
  visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: categories (English version)
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: productos
CREATE TABLE IF NOT EXISTS productos (
  id VARCHAR(100) PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,
  precio VARCHAR(50),
  imagen TEXT,
  categoria VARCHAR(100),
  marca VARCHAR(100),
  visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (categoria) REFERENCES categorias(id) ON DELETE SET NULL
);

-- Table: products (English version)
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  price INTEGER,
  image_url TEXT,
  category_id TEXT,
  is_promo BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Table: coupons
CREATE TABLE IF NOT EXISTS coupons (
  id SERIAL PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value NUMERIC(10, 2) NOT NULL,
  start_date DATE,
  end_date DATE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: delivery_methods
CREATE TABLE IF NOT EXISTS delivery_methods (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  delivery_cost NUMERIC(10, 2) DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: payment_methods
CREATE TABLE IF NOT EXISTS payment_methods (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: site_config
CREATE TABLE IF NOT EXISTS site_config (
  id SERIAL PRIMARY KEY,
  config_key VARCHAR(255) UNIQUE NOT NULL,
  config_value TEXT,
  description TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- ALTER TABLE: Add marca column if not exists
-- ============================================
ALTER TABLE productos ADD COLUMN IF NOT EXISTS marca VARCHAR(100);

-- ============================================
-- UPDATE: Set default brands for existing products
-- ============================================

-- Update relojes category products with sample brands
UPDATE productos 
SET marca = CASE 
  WHEN nombre ILIKE '%Casio%' THEN 'Casio'
  WHEN nombre ILIKE '%Seiko%' THEN 'Seiko'
  WHEN nombre ILIKE '%Citizen%' THEN 'Citizen'
  WHEN nombre ILIKE '%Rolex%' THEN 'Rolex'
  WHEN nombre ILIKE '%Omega%' THEN 'Omega'
  WHEN nombre ILIKE '%TAG%' THEN 'TAG Heuer'
  WHEN nombre ILIKE '%Tissot%' THEN 'Tissot'
  WHEN nombre ILIKE '%Hamilton%' THEN 'Hamilton'
  WHEN nombre ILIKE '%Longines%' THEN 'Longines'
  ELSE 'Otras Marcas'
END
WHERE categoria = 'relojes' AND (marca IS NULL OR marca = '');

-- For other categories, set default brand
UPDATE productos 
SET marca = 'General'
WHERE (marca IS NULL OR marca = '') AND categoria != 'relojes';

-- ============================================
-- INDEXES for better performance
-- ============================================

CREATE INDEX IF NOT EXISTS idx_productos_categoria ON productos(categoria);
CREATE INDEX IF NOT EXISTS idx_productos_marca ON productos(marca);
CREATE INDEX IF NOT EXISTS idx_productos_visible ON productos(visible);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);
CREATE INDEX IF NOT EXISTS idx_coupons_is_active ON coupons(is_active);
CREATE INDEX IF NOT EXISTS idx_site_config_key ON site_config(config_key);

-- ============================================
-- SAMPLE DATA (Optional - if needed)
-- ============================================

-- Insert default site config if not exists
INSERT INTO site_config (config_key, config_value, description)
VALUES 
  ('store_logo', '', 'Logo de la tienda'),
  ('contact_whatsapp', '+54 3512100007', 'Número de WhatsApp para contacto'),
  ('store_location', '', 'Ubicación de la tienda'),
  ('store_location_lat', '', 'Latitud de la ubicación'),
  ('store_location_lng', '', 'Longitud de la ubicación'),
  ('website_url', '', 'URL del sitio web'),
  ('instagram_url', '', 'URL de Instagram'),
  ('facebook_url', '', 'URL de Facebook'),
  ('banner_text', 'Prueba', 'Texto del banner promocional')
ON CONFLICT (config_key) DO NOTHING;

-- Insert default business hours config
INSERT INTO business_hours_config (allow_orders_when_closed)
VALUES (false)
ON CONFLICT DO NOTHING;

-- ============================================
-- END OF SCRIPT
-- ============================================

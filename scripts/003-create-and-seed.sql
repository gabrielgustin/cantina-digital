-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  image_url TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  category_id TEXT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  subtitle TEXT,
  price INTEGER NOT NULL,
  image_url TEXT,
  description TEXT,
  is_promo BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);

-- Insert categories
INSERT INTO categories (id, title, subtitle, image_url) VALUES
  ('pods', 'Indumentaria', '', '/images/indumentaria.png'),
  ('sales-nicotina', 'Utiles Escolares', '', '/images/utiles-escolares.png'),
  ('libreria-tecnica', 'Libreria Tecnica', '', '/images/libreria-tecnica.png'),
  ('apuntes', 'Apuntes', '', '/images/apuntes.png')
ON CONFLICT (id) DO NOTHING;

-- Insert products
INSERT INTO products (id, category_id, title, subtitle, price, image_url, description, is_promo) VALUES
  ('rabbeats-bc-10000-puffs', 'pods', 'Producto 1', 'Descartable', 15000, '/generic-vape-product.png', 'Descripcion', true),
  ('zomo-salt-nic-35mg', 'sales-nicotina', 'Producto 2', 'Descartable', 12500, '/school-supplies-product.jpg', 'descripcion', false)
ON CONFLICT (id) DO NOTHING;

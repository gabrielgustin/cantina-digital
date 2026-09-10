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

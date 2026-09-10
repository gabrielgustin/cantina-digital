-- Verificar y poblar categorías
INSERT INTO categories (id, title, subtitle, image_url) VALUES
  ('indumentaria', 'Indumentaria', 'Ropa y accesorios', '/placeholder.svg?height=400&width=400'),
  ('utiles-escolares', 'Útiles Escolares', 'Todo para la escuela', '/placeholder.svg?height=400&width=400'),
  ('libreria-tecnica', 'Librería Técnica', 'Libros y material técnico', '/placeholder.svg?height=400&width=400'),
  ('apuntes', 'Apuntes', 'Apuntes universitarios', '/placeholder.svg?height=400&width=400')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  image_url = EXCLUDED.image_url;

-- Verificar y poblar productos
INSERT INTO products (id, category_id, title, subtitle, price, image_url, description, is_promo) VALUES
  ('prod-indumentaria-1', 'indumentaria', 'Remera Universitaria', 'Algodón 100%', 5000, '/placeholder.svg?height=300&width=300', 'Remera de alta calidad', false),
  ('prod-indumentaria-2', 'indumentaria', 'Buzo con Capucha', 'Frisa Premium', 12000, '/placeholder.svg?height=300&width=300', 'Buzo abrigado', true),
  ('prod-utiles-1', 'utiles-escolares', 'Cuaderno A4', '80 hojas', 2500, '/placeholder.svg?height=300&width=300', 'Cuaderno rayado universitario', false),
  ('prod-utiles-2', 'utiles-escolares', 'Kit de Lapiceras', 'Set x 10 unidades', 3500, '/placeholder.svg?height=300&width=300', 'Lapiceras de colores', false),
  ('prod-libreria-1', 'libreria-tecnica', 'Calculadora Científica', 'Casio FX-991', 18000, '/placeholder.svg?height=300&width=300', 'Calculadora profesional', false),
  ('prod-libreria-2', 'libreria-tecnica', 'Regla T', 'Acrílico 60cm', 4500, '/placeholder.svg?height=300&width=300', 'Para dibujo técnico', false),
  ('prod-apuntes-1', 'apuntes', 'Apuntes Matemática', 'Cálculo I', 8000, '/placeholder.svg?height=300&width=300', 'Apuntes completos del curso', false),
  ('prod-apuntes-2', 'apuntes', 'Apuntes Física', 'Física General', 7500, '/placeholder.svg?height=300&width=300', 'Material de estudio', true)
ON CONFLICT (id) DO UPDATE SET
  category_id = EXCLUDED.category_id,
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  description = EXCLUDED.description,
  is_promo = EXCLUDED.is_promo;

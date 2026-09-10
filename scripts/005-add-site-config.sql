-- Crear tabla de configuración del sitio
CREATE TABLE IF NOT EXISTS site_config (
  id SERIAL PRIMARY KEY,
  config_key VARCHAR(100) UNIQUE NOT NULL,
  config_value TEXT NOT NULL,
  description TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add all site configuration fields
-- Updated header_logo_url to use .jpg extension
INSERT INTO site_config (config_key, config_value, description) 
VALUES 
  ('header_logo_url', '/images/logoitsvilada.jpg', 'URL del logo principal en el header'),
  ('site_name', 'ITS Boutique', 'Nombre del sitio'),
  ('site_description', 'Ofrecemos una amplia variedad de productos de calidad para satisfacer todas tus necesidades.', 'Descripción general del sitio'),
  ('contact_email', 'contacto@itsboutique.com', 'Email de contacto'),
  ('contact_phone', '+54 9 351 123-4567', 'Teléfono de contacto'),
  ('contact_whatsapp', '5493511234567', 'Número de WhatsApp (formato internacional sin +)'),
  ('address', 'Valle Escondido Camino a la Calera, Km 7.5, Córdoba', 'Dirección física del negocio'),
  ('business_hours', 'Lunes a Viernes: 08:00 - 17:00', 'Horario de atención'),
  ('instagram_url', 'https://www.instagram.com/boutiqueits?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==', 'URL de Instagram'),
  ('autogestiva_url', 'https://www.autogestiva.com.ar', 'URL de Autogestiva')
ON CONFLICT (config_key) DO UPDATE 
SET config_value = EXCLUDED.config_value,
    updated_at = CURRENT_TIMESTAMP;

-- Add color configuration to site_config table
-- These colors will be dynamically applied throughout the app

INSERT INTO site_config (config_key, config_value, description) 
VALUES 
  ('color_primario', '#1e4b8e', 'Color primario de la marca (azul principal)'),
  ('color_secundario', '#2c5aa0', 'Color secundario (azul más claro)'),
  ('color_acento', '#ff6b35', 'Color de acento para CTAs y destacados'),
  ('color_fondo', '#f8f9fa', 'Color de fondo principal'),
  ('color_texto', '#212529', 'Color de texto principal')
ON CONFLICT (config_key) DO UPDATE 
SET config_value = EXCLUDED.config_value,
    description = EXCLUDED.description;

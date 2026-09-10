-- Add promotional banner configuration to site_config
-- Changed from 'promo_banner_text' to 'banner_text' and 'promo_banner_enabled' to 'banner_enabled'
INSERT INTO site_config (config_key, config_value, description) 
VALUES 
  ('banner_text', 'PROMOCION 10% OFF EN PRODUCTOS SELECCIONADOS', 'Texto del banner promocional en la página principal'),
  ('banner_enabled', 'true', 'Activar o desactivar el banner promocional (true/false)')
ON CONFLICT (config_key) DO UPDATE 
SET config_value = EXCLUDED.config_value,
    description = EXCLUDED.description,
    updated_at = NOW();

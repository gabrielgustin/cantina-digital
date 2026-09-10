-- Add store_name and store_location to site_config if they don't exist
INSERT INTO site_config (config_key, config_value, description)
VALUES 
  ('store_name', 'ITS Boutique', 'Nombre del negocio')
ON CONFLICT (config_key) DO NOTHING;

INSERT INTO site_config (config_key, config_value, description)
VALUES 
  ('store_location', 'Av. Corrientes 1234, CABA', 'Ubicación del negocio')
ON CONFLICT (config_key) DO NOTHING;

-- Update existing site_name to store_name if needed
UPDATE site_config 
SET config_key = 'store_name' 
WHERE config_key = 'site_name' 
AND NOT EXISTS (SELECT 1 FROM site_config WHERE config_key = 'store_name');

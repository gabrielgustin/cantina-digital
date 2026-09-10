-- Add banner_enabled configuration to site_config table
-- This controls whether the promotional banner should be displayed

-- Insert or update the banner_enabled config
INSERT INTO site_config (config_key, config_value, description, updated_at)
VALUES (
  'banner_enabled',
  'true',
  'Controls whether the promotional banner is displayed (true/false)',
  NOW()
)
ON CONFLICT (config_key) 
DO UPDATE SET 
  config_value = EXCLUDED.config_value,
  description = EXCLUDED.description,
  updated_at = NOW();

-- Ensure banner_text exists (if not already created)
INSERT INTO site_config (config_key, config_value, description, updated_at)
VALUES (
  'banner_text',
  '10% OFF EN PRODUCTOS SELECCIONADOS',
  'Text to display in the promotional banner',
  NOW()
)
ON CONFLICT (config_key) 
DO UPDATE SET updated_at = NOW();

-- Update WhatsApp number to +5493512100007
UPDATE site_config 
SET config_value = '5493512100007' 
WHERE config_key = 'contact_whatsapp';

-- If the row doesn't exist, insert it
INSERT INTO site_config (config_key, config_value, description)
SELECT 'contact_whatsapp', '5493512100007', 'Número de WhatsApp (formato internacional sin +)'
WHERE NOT EXISTS (
  SELECT 1 FROM site_config WHERE config_key = 'contact_whatsapp'
);

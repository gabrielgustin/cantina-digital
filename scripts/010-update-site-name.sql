-- Update site name to M&M Relojes
UPDATE site_config
SET config_value = 'M&M Relojes'
WHERE config_key = 'site_name';

-- Verify the update
SELECT config_key, config_value
FROM site_config
WHERE config_key = 'site_name';

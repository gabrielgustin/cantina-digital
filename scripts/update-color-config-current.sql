-- Actualizar los colores de la aplicación con los valores actuales
-- Color principal: tupedido-blue #0A4D8F
-- Color secundario: tupedido-yellow #f5f5f7
-- Color de acento: se usa el mismo azul

-- Insertar o actualizar el color primario
INSERT INTO site_config (config_key, config_value)
VALUES ('color_primario', '#0A4D8F')
ON CONFLICT (config_key) 
DO UPDATE SET config_value = '#0A4D8F';

-- Insertar o actualizar el color secundario
INSERT INTO site_config (config_key, config_value)
VALUES ('color_secundario', '#f5f5f7')
ON CONFLICT (config_key) 
DO UPDATE SET config_value = '#f5f5f7';

-- Insertar o actualizar el color de acento (mismo que primario)
INSERT INTO site_config (config_key, config_value)
VALUES ('color_acento', '#0A4D8F')
ON CONFLICT (config_key) 
DO UPDATE SET config_value = '#0A4D8F';

-- Insertar o actualizar el color de fondo
INSERT INTO site_config (config_key, config_value)
VALUES ('color_fondo', '#ffffff')
ON CONFLICT (config_key) 
DO UPDATE SET config_value = '#ffffff';

-- Insertar o actualizar el color de texto
INSERT INTO site_config (config_key, config_value)
VALUES ('color_texto', '#1e293b')
ON CONFLICT (config_key) 
DO UPDATE SET config_value = '#1e293b';

-- Verificar los colores actualizados
SELECT config_key, config_value 
FROM site_config 
WHERE config_key LIKE 'color_%'
ORDER BY config_key;

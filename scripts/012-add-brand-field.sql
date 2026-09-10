-- Add brand/marca field to productos table
ALTER TABLE productos ADD COLUMN IF NOT EXISTS marca VARCHAR(100);

-- Update existing products with sample brands (for relojes category)
UPDATE productos 
SET marca = CASE 
  WHEN nombre LIKE '%Casio%' THEN 'Casio'
  WHEN nombre LIKE '%Seiko%' THEN 'Seiko'
  WHEN nombre LIKE '%Citizen%' THEN 'Citizen'
  WHEN nombre LIKE '%Rolex%' THEN 'Rolex'
  WHEN nombre LIKE '%Omega%' THEN 'Omega'
  WHEN nombre LIKE '%TAG%' THEN 'TAG Heuer'
  ELSE 'Otras marcas'
END
WHERE categoria = 'relojes' AND marca IS NULL;

-- For other categories, set a default brand
UPDATE productos 
SET marca = 'General'
WHERE marca IS NULL;

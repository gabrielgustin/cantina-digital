-- Fix image URLs in categories table
-- Replace any base64 or invalid URLs with proper placeholder URLs

UPDATE categories 
SET image_url = CASE 
  WHEN id = 'pods' THEN '/placeholder.svg?height=400&width=400'
  WHEN id = 'sales-nicotina' THEN '/placeholder.svg?height=400&width=400'
  WHEN id = 'libreria-tecnica' THEN '/placeholder.svg?height=400&width=400'
  WHEN id = 'apuntes' THEN '/placeholder.svg?height=400&width=400'
  ELSE '/placeholder.svg?height=400&width=400'
END
WHERE image_url LIKE 'data:image%' OR LENGTH(image_url) > 500;

-- Fix image URLs in products table
UPDATE products
SET image_url = '/placeholder.svg?height=300&width=300&query=' || COALESCE(title, 'producto')
WHERE image_url LIKE 'data:image%' OR LENGTH(image_url) > 500 OR image_url IS NULL;

-- Update specific products with better placeholders based on category
UPDATE products p
SET image_url = CASE 
  WHEN p.category_id = 'pods' THEN '/placeholder.svg?height=300&width=300' || p.title
  WHEN p.category_id = 'sales-nicotina' THEN '/placeholder.svg?height=300&width=300' || p.title
  WHEN p.category_id = 'libreria-tecnica' THEN '/placeholder.svg?height=300&width=300' || p.title
  WHEN p.category_id = 'apuntes' THEN '/placeholder.svg?height=300&width=300' || p.title
  ELSE '/placeholder.svg?height=300&width=300&query=' || p.title
END
WHERE image_url LIKE '/placeholder.svg%';

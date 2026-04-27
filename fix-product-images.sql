-- Fix localhost URLs in product images
-- Run this in Supabase Dashboard → SQL Editor

-- Check for localhost URLs in product images
SELECT 
  id, 
  name, 
  image_url,
  CASE 
    WHEN image_url LIKE '%localhost%' THEN 'HAS LOCALHOST URL'
    ELSE 'OK'
  END as status
FROM products 
WHERE image_url LIKE '%localhost%' 
   OR image_url LIKE '%127.0.0.1%';

-- Update localhost URLs to use relative paths or production URLs
UPDATE products 
SET image_url = REPLACE(
  image_url, 
  'http://localhost:7070/', 
  '/'
)
WHERE image_url LIKE '%localhost:7070%';

-- Also check for any other localhost variations
UPDATE products 
SET image_url = REPLACE(
  image_url, 
  'http://localhost:5173/', 
  '/'
)
WHERE image_url LIKE '%localhost:5173%';

UPDATE products 
SET image_url = REPLACE(
  image_url, 
  'http://127.0.0.1:7070/', 
  '/'
)
WHERE image_url LIKE '%127.0.0.1:7070%';

-- Verify the fixes
SELECT 
  id, 
  name, 
  image_url,
  CASE 
    WHEN image_url LIKE '%localhost%' OR image_url LIKE '%127.0.0.1%' THEN 'STILL HAS LOCALHOST'
    ELSE 'FIXED'
  END as status
FROM products;

-- Also check categories for localhost URLs
SELECT 
  id, 
  name, 
  image_url,
  CASE 
    WHEN image_url LIKE '%localhost%' THEN 'HAS LOCALHOST URL'
    ELSE 'OK'
  END as status
FROM categories 
WHERE image_url LIKE '%localhost%' 
   OR image_url LIKE '%127.0.0.1%';

-- Fix categories if needed
UPDATE categories 
SET image_url = REPLACE(
  image_url, 
  'http://localhost:7070/', 
  '/'
)
WHERE image_url LIKE '%localhost:7070%';

SELECT 'Product image URLs fixed' as result;

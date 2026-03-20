-- Test query to check if products exist
SELECT COUNT(*) as product_count FROM products WHERE is_active = true;

-- Check if categories exist
SELECT COUNT(*) as category_count FROM categories WHERE is_active = true;

-- Show first 5 products with category names
SELECT 
  p.id,
  p.name,
  p.price,
  p.discount_price,
  p.stock,
  p.unit,
  c.name as category_name
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
WHERE p.is_active = true
LIMIT 5;

-- Show all categories
SELECT * FROM categories WHERE is_active = true;

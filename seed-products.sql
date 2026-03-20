-- Insert Categories
INSERT INTO categories (name, description, slug, is_active) VALUES
('Fruits & Vegetables', 'Fresh fruits and vegetables from local farms', 'fruits-vegetables', true),
('Dairy & Eggs', 'Fresh dairy products and eggs', 'dairy-eggs', true),
('Bakery', 'Fresh bread, cakes, and pastries', 'bakery', true),
('Meat & Fish', 'Fresh meat and seafood', 'meat-fish', true),
('Pantry Staples', 'Rice, flour, oils, and cooking essentials', 'pantry-staples', true),
('Beverages', 'Juices, tea, coffee, and soft drinks', 'beverages', true),
('Snacks & Sweets', 'Chips, chocolates, and snacks', 'snacks-sweets', true),
('Personal Care', 'Soap, shampoo, and personal hygiene products', 'personal-care', true);

-- Insert Products
INSERT INTO products (name, description, price, discount_price, image_url, stock, unit, category_id, is_active) VALUES
-- Fruits & Vegetables
('Fresh Apples', 'Crisp and sweet red apples, perfect for snacking', 120.00, 100.00, null, 100, 'kg', (SELECT id FROM categories WHERE slug = 'fruits-vegetables'), true),
('Bananas', 'Ripe yellow bananas rich in potassium', 60.00, null, null, 150, 'dozen', (SELECT id FROM categories WHERE slug = 'fruits-vegetables'), true),
('Tomatoes', 'Fresh red tomatoes, ideal for cooking', 80.00, null, null, 80, 'kg', (SELECT id FROM categories WHERE slug = 'fruits-vegetables'), true),
('Potatoes', 'Fresh potatoes, versatile for all recipes', 40.00, null, null, 200, 'kg', (SELECT id FROM categories WHERE slug = 'fruits-vegetables'), true),
('Onions', 'Fresh red onions, essential for cooking', 50.00, null, null, 120, 'kg', (SELECT id FROM categories WHERE slug = 'fruits-vegetables'), true),
('Carrots', 'Fresh orange carrots, great for salads and cooking', 60.00, null, null, 90, 'kg', (SELECT id FROM categories WHERE slug = 'fruits-vegetables'), true),
('Spinach', 'Fresh green spinach, rich in iron and vitamins', 30.00, null, null, 60, 'bunch', (SELECT id FROM categories WHERE slug = 'fruits-vegetables'), true),
('Oranges', 'Juicy oranges, perfect for fresh juice', 100.00, 80.00, null, 80, 'dozen', (SELECT id FROM categories WHERE slug = 'fruits-vegetables'), true),

-- Dairy & Eggs
('Fresh Milk', 'Pure and fresh cow milk', 55.00, null, null, 50, 'liter', (SELECT id FROM categories WHERE slug = 'dairy-eggs'), true),
('Greek Yogurt', 'Creamy Greek yogurt, high in protein', 45.00, null, null, 40, 'cup', (SELECT id FROM categories WHERE slug = 'dairy-eggs'), true),
('Farm Eggs', 'Fresh farm eggs, free-range', 150.00, null, null, 100, 'dozen', (SELECT id FROM categories WHERE slug = 'dairy-eggs'), true),
('Butter', 'Pure butter, perfect for baking and cooking', 200.00, 180.00, null, 30, 'pack', (SELECT id FROM categories WHERE slug = 'dairy-eggs'), true),
('Cheese', 'Fresh cheese slices', 250.00, null, null, 25, 'pack', (SELECT id FROM categories WHERE slug = 'dairy-eggs'), true),
('Cottage Cheese', 'Fresh cottage cheese, high in protein', 120.00, null, null, 35, 'cup', (SELECT id FROM categories WHERE slug = 'dairy-eggs'), true),

-- Bakery
('Whole Wheat Bread', 'Freshly baked whole wheat bread', 40.00, null, null, 60, 'loaf', (SELECT id FROM categories WHERE slug = 'bakery'), true),
('Croissants', 'Buttery and flaky croissants', 25.00, null, null, 40, 'piece', (SELECT id FROM categories WHERE slug = 'bakery'), true),
('Chocolate Cake', 'Delicious chocolate cake, perfect for celebrations', 350.00, null, null, 15, 'cake', (SELECT id FROM categories WHERE slug = 'bakery'), true),
('Cookies', 'Fresh baked chocolate chip cookies', 80.00, null, null, 50, 'pack', (SELECT id FROM categories WHERE slug = 'bakery'), true),
('Bagels', 'Fresh bagels, perfect for breakfast', 60.00, null, null, 45, 'pack', (SELECT id FROM categories WHERE slug = 'bakery'), true),

-- Meat & Fish
('Chicken Breast', 'Fresh chicken breast, boneless and skinless', 280.00, 250.00, null, 40, 'kg', (SELECT id FROM categories WHERE slug = 'meat-fish'), true),
('Fresh Fish', 'Fresh local fish, perfect for grilling', 300.00, null, null, 30, 'kg', (SELECT id FROM categories WHERE slug = 'meat-fish'), true),
('Mutton', 'Fresh mutton, tender and flavorful', 450.00, null, null, 25, 'kg', (SELECT id FROM categories WHERE slug = 'meat-fish'), true),
('Eggs (Tray)', 'Fresh eggs in tray of 30', 300.00, null, null, 60, 'tray', (SELECT id FROM categories WHERE slug = 'meat-fish'), true),
('Sausages', 'Premium quality sausages', 180.00, null, null, 35, 'pack', (SELECT id FROM categories WHERE slug = 'meat-fish'), true),

-- Pantry Staples
('Basmati Rice', 'Premium quality basmati rice', 120.00, null, null, 80, 'kg', (SELECT id FROM categories WHERE slug = 'pantry-staples'), true),
('Cooking Oil', 'Refined cooking oil, 1 liter bottle', 150.00, null, null, 60, 'bottle', (SELECT id FROM categories WHERE slug = 'pantry-staples'), true),
('All Purpose Flour', 'Multi-purpose flour for baking and cooking', 80.00, null, null, 70, 'kg', (SELECT id FROM categories WHERE slug = 'pantry-staples'), true),
('Sugar', 'Pure white sugar', 50.00, null, null, 100, 'kg', (SELECT id FROM categories WHERE slug = 'pantry-staples'), true),
('Salt', 'Iodized table salt', 20.00, null, null, 120, 'pack', (SELECT id FROM categories WHERE slug = 'pantry-staples'), true),
('Turmeric Powder', 'Pure turmeric powder, organic', 60.00, null, null, 50, 'pack', (SELECT id FROM categories WHERE slug = 'pantry-staples'), true),
('Red Chili Powder', 'Spicy red chili powder', 80.00, null, null, 45, 'pack', (SELECT id FROM categories WHERE slug = 'pantry-staples'), true),

-- Beverages
('Orange Juice', 'Fresh orange juice, no added sugar', 120.00, null, null, 40, 'liter', (SELECT id FROM categories WHERE slug = 'beverages'), true),
('Green Tea', 'Premium green tea bags', 150.00, null, null, 60, 'box', (SELECT id FROM categories WHERE slug = 'beverages'), true),
('Coffee Powder', 'Premium coffee powder', 250.00, null, null, 35, 'pack', (SELECT id FROM categories WHERE slug = 'beverages'), true),
('Mineral Water', 'Pure mineral water, 1 liter bottle', 30.00, null, null, 100, 'bottle', (SELECT id FROM categories WHERE slug = 'beverages'), true),
('Soft Drinks', 'Assorted soft drinks pack', 100.00, null, null, 50, 'pack', (SELECT id FROM categories WHERE slug = 'beverages'), true),

-- Snacks & Sweets
('Potato Chips', 'Crispy potato chips, salted', 40.00, null, null, 80, 'pack', (SELECT id FROM categories WHERE slug = 'snacks-sweets'), true),
('Chocolate Bar', 'Premium chocolate bar', 80.00, null, null, 60, 'bar', (SELECT id FROM categories WHERE slug = 'snacks-sweets'), true),
('Biscuits', 'Sweet and crunchy biscuits', 50.00, null, null, 70, 'pack', (SELECT id FROM categories WHERE slug = 'snacks-sweets'), true),
('Popcorn', 'Microwave popcorn, butter flavor', 60.00, null, null, 55, 'pack', (SELECT id FROM categories WHERE slug = 'snacks-sweets'), true),
('Candy', 'Assorted candy mix', 100.00, null, null, 40, 'pack', (SELECT id FROM categories WHERE slug = 'snacks-sweets'), true),

-- Personal Care
('Soap', 'Moisturizing soap bar', 35.00, null, null, 90, 'bar', (SELECT id FROM categories WHERE slug = 'personal-care'), true),
('Shampoo', 'Herbal shampoo, 200ml bottle', 120.00, null, null, 60, 'bottle', (SELECT id FROM categories WHERE slug = 'personal-care'), true),
('Toothpaste', 'Fluoride toothpaste, 100g tube', 80.00, null, null, 70, 'tube', (SELECT id FROM categories WHERE slug = 'personal-care'), true),
('Hand Sanitizer', 'Alcohol-based hand sanitizer', 50.00, null, null, 80, 'bottle', (SELECT id FROM categories WHERE slug = 'personal-care'), true),
('Face Wash', 'Gentle face wash, 100ml', 150.00, null, null, 45, 'bottle', (SELECT id FROM categories WHERE slug = 'personal-care'), true);

-- Update some products with ratings and reviews
UPDATE products SET 
  ratings = 4.5, 
  total_reviews = 128 
WHERE name IN ('Fresh Apples', 'Fresh Milk', 'Whole Wheat Bread', 'Chicken Breast');

UPDATE products SET 
  ratings = 4.2, 
  total_reviews = 89 
WHERE name IN ('Bananas', 'Greek Yogurt', 'Croissants', 'Fresh Fish');

UPDATE products SET 
  ratings = 4.8, 
  total_reviews = 203 
WHERE name IN ('Basmati Rice', 'Cooking Oil', 'Orange Juice');

UPDATE products SET 
  ratings = 3.9, 
  total_reviews = 45 
WHERE name IN ('Potato Chips', 'Chocolate Bar', 'Soap');

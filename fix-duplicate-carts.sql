-- FIX DUPLICATE CARTS - Final Solution
-- Run this in Supabase Dashboard → SQL Editor

-- Step 1: Delete duplicate carts (keep only the first one for each user)
DELETE FROM cart_items
WHERE cart_id NOT IN (
  SELECT id
  FROM (
    SELECT DISTINCT ON (user_id) id
    FROM cart
    ORDER BY user_id, created_at
  ) AS first_carts
);

DELETE FROM cart
WHERE id NOT IN (
  SELECT id
  FROM (
    SELECT DISTINCT ON (user_id) id
    FROM cart
    ORDER BY user_id, created_at
  ) AS first_carts
);

-- Step 2: Add unique constraint to prevent future duplicates
ALTER TABLE cart
ADD CONSTRAINT unique_user_cart UNIQUE(user_id);

-- Step 3: Verify the fix
SELECT 
  'Duplicate carts cleaned' as status,
  (SELECT COUNT(*) FROM cart) as total_carts,
  (SELECT COUNT(DISTINCT user_id) FROM cart) as unique_users;

-- Step 4: Show sample data to confirm
SELECT 
  c.id,
  c.user_id,
  COUNT(ci.id) as item_count
FROM cart c
LEFT JOIN cart_items ci ON c.id = ci.cart_id
GROUP BY c.id, c.user_id
ORDER BY c.created_at DESC
LIMIT 5;

SELECT '✅ DUPLICATE CARTS FIXED SUCCESSFULLY' as result;

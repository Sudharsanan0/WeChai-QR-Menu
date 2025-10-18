-- Drop the old category check constraint
ALTER TABLE public.menu_items 
DROP CONSTRAINT IF EXISTS menu_items_category_check;

-- Add new category check constraint with all the categories
ALTER TABLE public.menu_items 
ADD CONSTRAINT menu_items_category_check 
CHECK (category IN (
  'tea',
  'coffee', 
  'milk_varieties',
  'fresh_juice',
  'sandwiches',
  'french_fries',
  'bun_varieties',
  'momos_varieties',
  'pasta_varieties',
  'masala_pav_bhaji',
  'maggi_varieties',
  'milkshake_varieties',
  'signature_dish',
  'new_dish'
));
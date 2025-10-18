-- Add rating column to menu_items table
ALTER TABLE public.menu_items 
ADD COLUMN rating numeric CHECK (rating >= 0 AND rating <= 5) DEFAULT NULL;
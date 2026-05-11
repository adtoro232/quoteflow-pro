-- QuoteFlow Pro — Product Images Migration
-- Voer dit uit in Supabase SQL Editor: Dashboard > SQL Editor > New query

-- 1. Add image_url column to products
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS image_url text;

-- 2. Storage bucket aanmaken + policies
-- Ga naar Supabase Dashboard > Storage > New bucket
-- Naam: product-images, Public: aan
-- Of voer onderstaande uit (vereist service_role):

INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Public read
CREATE POLICY IF NOT EXISTS "product_images_public_read"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

-- Authenticated upload
CREATE POLICY IF NOT EXISTS "product_images_auth_insert"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'product-images' AND auth.uid() IS NOT NULL);

-- Authenticated update
CREATE POLICY IF NOT EXISTS "product_images_auth_update"
ON storage.objects FOR UPDATE
USING (bucket_id = 'product-images' AND auth.uid() IS NOT NULL);

-- Authenticated delete
CREATE POLICY IF NOT EXISTS "product_images_auth_delete"
ON storage.objects FOR DELETE
USING (bucket_id = 'product-images' AND auth.uid() IS NOT NULL);

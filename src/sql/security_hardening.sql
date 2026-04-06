-- Security hardening baseline for Supabase auth, RLS, storage and grants.

UPDATE auth.users
SET raw_app_meta_data = COALESCE(raw_app_meta_data, '{}'::jsonb)
    || jsonb_build_object('role', 'admin', 'roles', jsonb_build_array('admin'))
WHERE email = 'admin@admin.com';

DELETE FROM auth.refresh_tokens
WHERE user_id IN (
    SELECT id::text
    FROM auth.users
    WHERE email = 'admin@admin.com'
);

DELETE FROM auth.sessions
WHERE user_id IN (
    SELECT id
    FROM auth.users
    WHERE email = 'admin@admin.com'
);

DO $$
DECLARE
    policy_record RECORD;
BEGIN
    FOR policy_record IN
        SELECT schemaname, tablename, policyname
        FROM pg_policies
        WHERE (
            schemaname = 'public'
            AND tablename = ANY (ARRAY[
                'categories',
                'products',
                'product_variations',
                'product_images',
                'store_settings',
                'orders',
                'order_items'
            ])
        )
        OR (schemaname = 'storage' AND tablename = 'objects')
    LOOP
        EXECUTE format(
            'DROP POLICY IF EXISTS %I ON %I.%I',
            policy_record.policyname,
            policy_record.schemaname,
            policy_record.tablename
        );
    END LOOP;
END
$$;

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.categories FROM anon;
REVOKE ALL ON TABLE public.categories FROM authenticated;
REVOKE ALL ON TABLE public.products FROM anon;
REVOKE ALL ON TABLE public.products FROM authenticated;
REVOKE ALL ON TABLE public.product_variations FROM anon;
REVOKE ALL ON TABLE public.product_variations FROM authenticated;
REVOKE ALL ON TABLE public.product_images FROM anon;
REVOKE ALL ON TABLE public.product_images FROM authenticated;
REVOKE ALL ON TABLE public.store_settings FROM anon;
REVOKE ALL ON TABLE public.store_settings FROM authenticated;
REVOKE ALL ON TABLE public.orders FROM anon;
REVOKE ALL ON TABLE public.orders FROM authenticated;
REVOKE ALL ON TABLE public.order_items FROM anon;
REVOKE ALL ON TABLE public.order_items FROM authenticated;

GRANT SELECT ON TABLE public.categories TO anon;
GRANT SELECT ON TABLE public.categories TO authenticated;
GRANT INSERT, UPDATE, DELETE ON TABLE public.categories TO authenticated;

GRANT SELECT ON TABLE public.products TO anon;
GRANT SELECT ON TABLE public.products TO authenticated;
GRANT INSERT, UPDATE, DELETE ON TABLE public.products TO authenticated;

GRANT SELECT ON TABLE public.product_variations TO anon;
GRANT SELECT ON TABLE public.product_variations TO authenticated;
GRANT INSERT, UPDATE, DELETE ON TABLE public.product_variations TO authenticated;

GRANT SELECT ON TABLE public.product_images TO anon;
GRANT SELECT ON TABLE public.product_images TO authenticated;
GRANT INSERT, UPDATE, DELETE ON TABLE public.product_images TO authenticated;

GRANT SELECT ON TABLE public.store_settings TO anon;
GRANT SELECT ON TABLE public.store_settings TO authenticated;
GRANT INSERT, UPDATE, DELETE ON TABLE public.store_settings TO authenticated;

GRANT SELECT ON TABLE public.orders TO authenticated;
GRANT SELECT ON TABLE public.order_items TO authenticated;

CREATE POLICY "Public read categories"
ON public.categories
FOR SELECT
TO public
USING (true);

CREATE POLICY "Admin manage categories"
ON public.categories
FOR ALL
TO authenticated
USING (
    COALESCE(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin'
    OR COALESCE(auth.jwt() -> 'app_metadata' -> 'roles', '[]'::jsonb) ? 'admin'
)
WITH CHECK (
    COALESCE(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin'
    OR COALESCE(auth.jwt() -> 'app_metadata' -> 'roles', '[]'::jsonb) ? 'admin'
);

CREATE POLICY "Public read active products"
ON public.products
FOR SELECT
TO public
USING (is_active = true);

CREATE POLICY "Admin manage products"
ON public.products
FOR ALL
TO authenticated
USING (
    COALESCE(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin'
    OR COALESCE(auth.jwt() -> 'app_metadata' -> 'roles', '[]'::jsonb) ? 'admin'
)
WITH CHECK (
    COALESCE(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin'
    OR COALESCE(auth.jwt() -> 'app_metadata' -> 'roles', '[]'::jsonb) ? 'admin'
);

CREATE POLICY "Public read product variations"
ON public.product_variations
FOR SELECT
TO public
USING (true);

CREATE POLICY "Admin manage product variations"
ON public.product_variations
FOR ALL
TO authenticated
USING (
    COALESCE(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin'
    OR COALESCE(auth.jwt() -> 'app_metadata' -> 'roles', '[]'::jsonb) ? 'admin'
)
WITH CHECK (
    COALESCE(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin'
    OR COALESCE(auth.jwt() -> 'app_metadata' -> 'roles', '[]'::jsonb) ? 'admin'
);

CREATE POLICY "Public read product images"
ON public.product_images
FOR SELECT
TO public
USING (true);

CREATE POLICY "Admin manage product images"
ON public.product_images
FOR ALL
TO authenticated
USING (
    COALESCE(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin'
    OR COALESCE(auth.jwt() -> 'app_metadata' -> 'roles', '[]'::jsonb) ? 'admin'
)
WITH CHECK (
    COALESCE(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin'
    OR COALESCE(auth.jwt() -> 'app_metadata' -> 'roles', '[]'::jsonb) ? 'admin'
);

CREATE POLICY "Public read store settings"
ON public.store_settings
FOR SELECT
TO public
USING (true);

CREATE POLICY "Admin manage store settings"
ON public.store_settings
FOR ALL
TO authenticated
USING (
    COALESCE(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin'
    OR COALESCE(auth.jwt() -> 'app_metadata' -> 'roles', '[]'::jsonb) ? 'admin'
)
WITH CHECK (
    COALESCE(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin'
    OR COALESCE(auth.jwt() -> 'app_metadata' -> 'roles', '[]'::jsonb) ? 'admin'
);

CREATE POLICY "Authenticated users can read own orders"
ON public.orders
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage orders"
ON public.orders
FOR ALL
TO authenticated
USING (
    COALESCE(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin'
    OR COALESCE(auth.jwt() -> 'app_metadata' -> 'roles', '[]'::jsonb) ? 'admin'
)
WITH CHECK (
    COALESCE(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin'
    OR COALESCE(auth.jwt() -> 'app_metadata' -> 'roles', '[]'::jsonb) ? 'admin'
);

CREATE POLICY "Authenticated users can read own order items"
ON public.order_items
FOR SELECT
TO authenticated
USING (
    order_id IN (
        SELECT id
        FROM public.orders
        WHERE user_id = auth.uid()
    )
);

CREATE POLICY "Admins can manage order items"
ON public.order_items
FOR ALL
TO authenticated
USING (
    COALESCE(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin'
    OR COALESCE(auth.jwt() -> 'app_metadata' -> 'roles', '[]'::jsonb) ? 'admin'
)
WITH CHECK (
    COALESCE(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin'
    OR COALESCE(auth.jwt() -> 'app_metadata' -> 'roles', '[]'::jsonb) ? 'admin'
);

UPDATE storage.buckets
SET public = true,
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY[
        'image/jpeg',
        'image/png',
        'image/webp',
        'image/avif',
        'image/gif'
    ]
WHERE id = 'product-images';

CREATE POLICY "Public read product-images bucket"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'product-images');

CREATE POLICY "Admin insert product-images bucket"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'product-images'
    AND (
        COALESCE(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin'
        OR COALESCE(auth.jwt() -> 'app_metadata' -> 'roles', '[]'::jsonb) ? 'admin'
    )
);

CREATE POLICY "Admin update product-images bucket"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
    bucket_id = 'product-images'
    AND (
        COALESCE(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin'
        OR COALESCE(auth.jwt() -> 'app_metadata' -> 'roles', '[]'::jsonb) ? 'admin'
    )
)
WITH CHECK (
    bucket_id = 'product-images'
    AND (
        COALESCE(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin'
        OR COALESCE(auth.jwt() -> 'app_metadata' -> 'roles', '[]'::jsonb) ? 'admin'
    )
);

CREATE POLICY "Admin delete product-images bucket"
ON storage.objects
FOR DELETE
TO authenticated
USING (
    bucket_id = 'product-images'
    AND (
        COALESCE(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin'
        OR COALESCE(auth.jwt() -> 'app_metadata' -> 'roles', '[]'::jsonb) ? 'admin'
    )
);

DROP FUNCTION IF EXISTS public.decrement_stock(UUID, INT);

CREATE OR REPLACE FUNCTION public.decrement_stock(p_variation_id UUID, p_quantity INT)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    updated_rows INT;
BEGIN
    IF p_quantity IS NULL OR p_quantity <= 0 THEN
        RETURN false;
    END IF;

    UPDATE public.product_variations
    SET stock_quantity = stock_quantity - p_quantity
    WHERE id = p_variation_id
      AND stock_quantity >= p_quantity;

    GET DIAGNOSTICS updated_rows = ROW_COUNT;
    RETURN updated_rows = 1;
END;
$$;

REVOKE ALL ON FUNCTION public.decrement_stock(UUID, INT) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.decrement_stock(UUID, INT) FROM anon;
REVOKE ALL ON FUNCTION public.decrement_stock(UUID, INT) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.decrement_stock(UUID, INT) TO service_role;

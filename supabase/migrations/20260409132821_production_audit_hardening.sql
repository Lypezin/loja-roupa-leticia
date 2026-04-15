CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SET search_path = public
AS $$
    SELECT
        COALESCE(((SELECT auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin', FALSE)
        OR COALESCE((((SELECT auth.jwt()) -> 'app_metadata' -> 'roles') ? 'admin'), FALSE);
$$;

CREATE OR REPLACE FUNCTION public.jsonb_text_array_to_csv(p_value JSONB)
RETURNS TEXT
LANGUAGE sql
IMMUTABLE
SET search_path = public
AS $$
    SELECT NULLIF(string_agg(value, ', ' ORDER BY ordinality), '')
    FROM jsonb_array_elements_text(
        CASE
            WHEN jsonb_typeof(p_value) = 'array' THEN p_value
            ELSE '[]'::jsonb
        END
    ) WITH ORDINALITY AS t(value, ordinality);
$$;

CREATE OR REPLACE FUNCTION public.normalize_abacatepay_attempt_metadata()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
    v_data JSONB := CASE WHEN jsonb_typeof(NEW.raw_response) = 'object' THEN COALESCE(NEW.raw_response -> 'data', '{}'::jsonb) ELSE '{}'::jsonb END;
    v_billing JSONB := CASE WHEN jsonb_typeof(v_data -> 'billing') = 'object' THEN v_data -> 'billing' ELSE '{}'::jsonb END;
    v_checkout JSONB := CASE WHEN jsonb_typeof(v_data -> 'checkout') = 'object' THEN v_data -> 'checkout' ELSE '{}'::jsonb END;
    v_payment JSONB := CASE WHEN jsonb_typeof(v_data -> 'payment') = 'object' THEN v_data -> 'payment' ELSE '{}'::jsonb END;
    v_customer JSONB := CASE WHEN jsonb_typeof(v_data -> 'customer') = 'object' THEN v_data -> 'customer' ELSE '{}'::jsonb END;
    v_billing_customer JSONB := CASE WHEN jsonb_typeof(v_billing -> 'customer') = 'object' THEN v_billing -> 'customer' ELSE '{}'::jsonb END;
    v_customer_metadata JSONB := CASE WHEN jsonb_typeof(v_billing_customer -> 'metadata') = 'object' THEN v_billing_customer -> 'metadata' ELSE '{}'::jsonb END;
    v_method TEXT;
    v_receipt_url TEXT;
    v_checkout_id TEXT;
    v_external_id TEXT;
BEGIN
    IF NEW.provider IS DISTINCT FROM 'abacatepay' OR NEW.raw_response IS NULL THEN
        RETURN NEW;
    END IF;

    v_method := COALESCE(
        NULLIF(BTRIM(NEW.payment_method), ''),
        NULLIF(BTRIM(v_payment ->> 'method'), ''),
        NULLIF(BTRIM(v_data #>> '{payerInformation,method}'), ''),
        NULLIF(BTRIM(v_billing ->> 'method'), ''),
        NULLIF(BTRIM(v_checkout ->> 'method'), ''),
        public.jsonb_text_array_to_csv(v_billing -> 'kind'),
        public.jsonb_text_array_to_csv(v_billing -> 'methods'),
        public.jsonb_text_array_to_csv(v_checkout -> 'methods')
    );

    v_receipt_url := COALESCE(
        NULLIF(BTRIM(NEW.receipt_url), ''),
        NULLIF(BTRIM(v_payment ->> 'receiptUrl'), ''),
        NULLIF(BTRIM(v_billing ->> 'receiptUrl'), ''),
        NULLIF(BTRIM(v_checkout ->> 'receiptUrl'), '')
    );

    v_checkout_id := COALESCE(
        NULLIF(BTRIM(NEW.checkout_id), ''),
        NULLIF(BTRIM(v_billing ->> 'id'), ''),
        NULLIF(BTRIM(v_checkout ->> 'id'), '')
    );

    v_external_id := COALESCE(
        NULLIF(BTRIM(NEW.external_id), ''),
        NULLIF(BTRIM(v_billing ->> 'externalId'), ''),
        NULLIF(BTRIM(v_checkout ->> 'externalId'), '')
    );

    NEW.payment_method := v_method;
    NEW.receipt_url := v_receipt_url;
    NEW.checkout_id := v_checkout_id;
    NEW.external_id := v_external_id;
    NEW.customer_email := COALESCE(
        NULLIF(BTRIM(NEW.customer_email), ''),
        NULLIF(BTRIM(v_customer ->> 'email'), ''),
        NULLIF(BTRIM(v_customer_metadata ->> 'email'), '')
    );
    NEW.customer_name := COALESCE(
        NULLIF(BTRIM(NEW.customer_name), ''),
        NULLIF(BTRIM(v_customer ->> 'name'), ''),
        NULLIF(BTRIM(v_customer_metadata ->> 'name'), '')
    );

    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.sync_abacatepay_order_metadata()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
    v_data JSONB := CASE WHEN jsonb_typeof(NEW.raw_response) = 'object' THEN COALESCE(NEW.raw_response -> 'data', '{}'::jsonb) ELSE '{}'::jsonb END;
    v_billing JSONB := CASE WHEN jsonb_typeof(v_data -> 'billing') = 'object' THEN v_data -> 'billing' ELSE '{}'::jsonb END;
    v_checkout JSONB := CASE WHEN jsonb_typeof(v_data -> 'checkout') = 'object' THEN v_data -> 'checkout' ELSE '{}'::jsonb END;
    v_payment JSONB := CASE WHEN jsonb_typeof(v_data -> 'payment') = 'object' THEN v_data -> 'payment' ELSE '{}'::jsonb END;
    v_customer JSONB := CASE WHEN jsonb_typeof(v_data -> 'customer') = 'object' THEN v_data -> 'customer' ELSE '{}'::jsonb END;
    v_billing_customer JSONB := CASE WHEN jsonb_typeof(v_billing -> 'customer') = 'object' THEN v_billing -> 'customer' ELSE '{}'::jsonb END;
    v_customer_metadata JSONB := CASE WHEN jsonb_typeof(v_billing_customer -> 'metadata') = 'object' THEN v_billing_customer -> 'metadata' ELSE '{}'::jsonb END;
    v_method TEXT;
    v_receipt_url TEXT;
    v_checkout_id TEXT;
    v_external_id TEXT;
    v_customer_email TEXT;
    v_customer_name TEXT;
    v_raw_status TEXT;
BEGIN
    IF NEW.provider IS DISTINCT FROM 'abacatepay' THEN
        RETURN NEW;
    END IF;

    v_method := COALESCE(
        NULLIF(BTRIM(NEW.payment_method), ''),
        NULLIF(BTRIM(v_payment ->> 'method'), ''),
        NULLIF(BTRIM(v_data #>> '{payerInformation,method}'), ''),
        NULLIF(BTRIM(v_billing ->> 'method'), ''),
        NULLIF(BTRIM(v_checkout ->> 'method'), ''),
        public.jsonb_text_array_to_csv(v_billing -> 'kind'),
        public.jsonb_text_array_to_csv(v_billing -> 'methods'),
        public.jsonb_text_array_to_csv(v_checkout -> 'methods')
    );

    v_receipt_url := COALESCE(
        NULLIF(BTRIM(NEW.receipt_url), ''),
        NULLIF(BTRIM(v_payment ->> 'receiptUrl'), ''),
        NULLIF(BTRIM(v_billing ->> 'receiptUrl'), ''),
        NULLIF(BTRIM(v_checkout ->> 'receiptUrl'), '')
    );

    v_checkout_id := COALESCE(
        NULLIF(BTRIM(NEW.checkout_id), ''),
        NULLIF(BTRIM(v_billing ->> 'id'), ''),
        NULLIF(BTRIM(v_checkout ->> 'id'), '')
    );

    v_external_id := COALESCE(
        NULLIF(BTRIM(NEW.external_id), ''),
        NULLIF(BTRIM(v_billing ->> 'externalId'), ''),
        NULLIF(BTRIM(v_checkout ->> 'externalId'), '')
    );

    v_customer_email := COALESCE(
        NULLIF(BTRIM(NEW.customer_email), ''),
        NULLIF(BTRIM(v_customer ->> 'email'), ''),
        NULLIF(BTRIM(v_customer_metadata ->> 'email'), '')
    );

    v_customer_name := COALESCE(
        NULLIF(BTRIM(NEW.customer_name), ''),
        NULLIF(BTRIM(v_customer ->> 'name'), ''),
        NULLIF(BTRIM(v_customer_metadata ->> 'name'), '')
    );

    v_raw_status := COALESCE(
        NULLIF(BTRIM(NEW.status), ''),
        NULLIF(BTRIM(v_billing ->> 'status'), ''),
        NULLIF(BTRIM(v_checkout ->> 'status'), ''),
        NULLIF(BTRIM(v_payment ->> 'status'), '')
    );

    UPDATE public.orders AS o
    SET payment_method = COALESCE(NULLIF(BTRIM(o.payment_method), ''), v_method),
        payment_receipt_url = COALESCE(NULLIF(BTRIM(o.payment_receipt_url), ''), v_receipt_url),
        customer_email = COALESCE(NULLIF(BTRIM(o.customer_email), ''), v_customer_email),
        customer_name = COALESCE(NULLIF(BTRIM(o.customer_name), ''), v_customer_name),
        payment_raw_status = COALESCE(NULLIF(BTRIM(o.payment_raw_status), ''), v_raw_status),
        updated_at = timezone('utc'::text, now())
    WHERE o.payment_provider = 'abacatepay'
      AND (
        (v_external_id IS NOT NULL AND o.payment_external_id = v_external_id)
        OR (v_checkout_id IS NOT NULL AND o.payment_checkout_id = v_checkout_id)
      );

    RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.jsonb_text_array_to_csv(JSONB) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.jsonb_text_array_to_csv(JSONB) TO postgres, service_role;

REVOKE ALL ON FUNCTION public.normalize_abacatepay_attempt_metadata() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.normalize_abacatepay_attempt_metadata() TO postgres, service_role;

REVOKE ALL ON FUNCTION public.sync_abacatepay_order_metadata() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.sync_abacatepay_order_metadata() TO postgres, service_role;

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders USING btree (user_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items USING btree (order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON public.order_items USING btree (product_id);
CREATE INDEX IF NOT EXISTS idx_order_items_variation_id ON public.order_items USING btree (variation_id);
CREATE INDEX IF NOT EXISTS idx_payment_attempts_user_id ON public.payment_attempts USING btree (user_id);

DROP POLICY IF EXISTS "Admin manage categories" ON public.categories;
CREATE POLICY "Admin insert categories" ON public.categories
FOR INSERT TO authenticated
WITH CHECK ((SELECT public.is_admin()));
CREATE POLICY "Admin update categories" ON public.categories
FOR UPDATE TO authenticated
USING ((SELECT public.is_admin()))
WITH CHECK ((SELECT public.is_admin()));
CREATE POLICY "Admin delete categories" ON public.categories
FOR DELETE TO authenticated
USING ((SELECT public.is_admin()));

DROP POLICY IF EXISTS "Admin manage product images" ON public.product_images;
CREATE POLICY "Admin insert product images" ON public.product_images
FOR INSERT TO authenticated
WITH CHECK ((SELECT public.is_admin()));
CREATE POLICY "Admin update product images" ON public.product_images
FOR UPDATE TO authenticated
USING ((SELECT public.is_admin()))
WITH CHECK ((SELECT public.is_admin()));
CREATE POLICY "Admin delete product images" ON public.product_images
FOR DELETE TO authenticated
USING ((SELECT public.is_admin()));

DROP POLICY IF EXISTS "Admin manage product variations" ON public.product_variations;
CREATE POLICY "Admin insert product variations" ON public.product_variations
FOR INSERT TO authenticated
WITH CHECK ((SELECT public.is_admin()));
CREATE POLICY "Admin update product variations" ON public.product_variations
FOR UPDATE TO authenticated
USING ((SELECT public.is_admin()))
WITH CHECK ((SELECT public.is_admin()));
CREATE POLICY "Admin delete product variations" ON public.product_variations
FOR DELETE TO authenticated
USING ((SELECT public.is_admin()));

DROP POLICY IF EXISTS "Admin manage store settings" ON public.store_settings;
CREATE POLICY "Admin insert store settings" ON public.store_settings
FOR INSERT TO authenticated
WITH CHECK ((SELECT public.is_admin()));
CREATE POLICY "Admin update store settings" ON public.store_settings
FOR UPDATE TO authenticated
USING ((SELECT public.is_admin()))
WITH CHECK ((SELECT public.is_admin()));
CREATE POLICY "Admin delete store settings" ON public.store_settings
FOR DELETE TO authenticated
USING ((SELECT public.is_admin()));

DROP POLICY IF EXISTS "Admin manage products" ON public.products;
DROP POLICY IF EXISTS "Public read active products" ON public.products;
CREATE POLICY "Public and admin read products" ON public.products
FOR SELECT TO public
USING (is_active OR (SELECT public.is_admin()));
CREATE POLICY "Admin insert products" ON public.products
FOR INSERT TO authenticated
WITH CHECK ((SELECT public.is_admin()));
CREATE POLICY "Admin update products" ON public.products
FOR UPDATE TO authenticated
USING ((SELECT public.is_admin()))
WITH CHECK ((SELECT public.is_admin()));
CREATE POLICY "Admin delete products" ON public.products
FOR DELETE TO authenticated
USING ((SELECT public.is_admin()));

DROP POLICY IF EXISTS "Admins can manage orders" ON public.orders;
DROP POLICY IF EXISTS "Authenticated users can read own orders" ON public.orders;
CREATE POLICY "Own and admin read orders" ON public.orders
FOR SELECT TO authenticated
USING (((SELECT public.is_admin()) OR ((SELECT auth.uid()) = user_id)));
CREATE POLICY "Admin insert orders" ON public.orders
FOR INSERT TO authenticated
WITH CHECK ((SELECT public.is_admin()));
CREATE POLICY "Admin update orders" ON public.orders
FOR UPDATE TO authenticated
USING ((SELECT public.is_admin()))
WITH CHECK ((SELECT public.is_admin()));
CREATE POLICY "Admin delete orders" ON public.orders
FOR DELETE TO authenticated
USING ((SELECT public.is_admin()));

DROP POLICY IF EXISTS "Admins can manage order items" ON public.order_items;
DROP POLICY IF EXISTS "Authenticated users can read own order items" ON public.order_items;
CREATE POLICY "Own and admin read order items" ON public.order_items
FOR SELECT TO authenticated
USING (
    (SELECT public.is_admin())
    OR EXISTS (
        SELECT 1
        FROM public.orders
        WHERE orders.id = order_items.order_id
          AND orders.user_id = (SELECT auth.uid())
    )
);
CREATE POLICY "Admin insert order items" ON public.order_items
FOR INSERT TO authenticated
WITH CHECK ((SELECT public.is_admin()));
CREATE POLICY "Admin update order items" ON public.order_items
FOR UPDATE TO authenticated
USING ((SELECT public.is_admin()))
WITH CHECK ((SELECT public.is_admin()));
CREATE POLICY "Admin delete order items" ON public.order_items
FOR DELETE TO authenticated
USING ((SELECT public.is_admin()));

DROP POLICY IF EXISTS "Admins can manage payment attempts" ON public.payment_attempts;
DROP POLICY IF EXISTS "Authenticated users can read own payment attempts" ON public.payment_attempts;
CREATE POLICY "Own and admin read payment attempts" ON public.payment_attempts
FOR SELECT TO authenticated
USING (((SELECT public.is_admin()) OR ((SELECT auth.uid()) = user_id)));
CREATE POLICY "Admin insert payment attempts" ON public.payment_attempts
FOR INSERT TO authenticated
WITH CHECK ((SELECT public.is_admin()));
CREATE POLICY "Admin update payment attempts" ON public.payment_attempts
FOR UPDATE TO authenticated
USING ((SELECT public.is_admin()))
WITH CHECK ((SELECT public.is_admin()));
CREATE POLICY "Admin delete payment attempts" ON public.payment_attempts
FOR DELETE TO authenticated
USING ((SELECT public.is_admin()));

DROP POLICY IF EXISTS "Admin delete product-images bucket" ON storage.objects;
DROP POLICY IF EXISTS "Admin insert product-images bucket" ON storage.objects;
DROP POLICY IF EXISTS "Admin update product-images bucket" ON storage.objects;

CREATE POLICY "Admin insert product-images bucket" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (
    bucket_id = 'product-images'
    AND (SELECT public.is_admin())
);

CREATE POLICY "Admin update product-images bucket" ON storage.objects
FOR UPDATE TO authenticated
USING (
    bucket_id = 'product-images'
    AND (SELECT public.is_admin())
)
WITH CHECK (
    bucket_id = 'product-images'
    AND (SELECT public.is_admin())
);

CREATE POLICY "Admin delete product-images bucket" ON storage.objects
FOR DELETE TO authenticated
USING (
    bucket_id = 'product-images'
    AND (SELECT public.is_admin())
);

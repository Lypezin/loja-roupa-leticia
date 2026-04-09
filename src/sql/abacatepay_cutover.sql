ALTER TABLE public.orders
    ALTER COLUMN stripe_session_id DROP NOT NULL;

ALTER TABLE public.orders
    ADD COLUMN IF NOT EXISTS payment_provider TEXT,
    ADD COLUMN IF NOT EXISTS payment_checkout_id TEXT,
    ADD COLUMN IF NOT EXISTS payment_external_id TEXT,
    ADD COLUMN IF NOT EXISTS payment_receipt_url TEXT,
    ADD COLUMN IF NOT EXISTS payment_method TEXT,
    ADD COLUMN IF NOT EXISTS payment_transaction_id TEXT,
    ADD COLUMN IF NOT EXISTS payment_raw_status TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS orders_payment_checkout_id_unique
    ON public.orders (payment_provider, payment_checkout_id)
    WHERE payment_checkout_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS orders_payment_external_id_unique
    ON public.orders (payment_provider, payment_external_id)
    WHERE payment_external_id IS NOT NULL;

CREATE TABLE IF NOT EXISTS public.payment_attempts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    provider TEXT NOT NULL,
    external_id TEXT NOT NULL UNIQUE,
    checkout_id TEXT UNIQUE,
    checkout_url TEXT,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    trusted_items JSONB NOT NULL,
    total_amount NUMERIC(10, 2) NOT NULL,
    customer_email TEXT NOT NULL,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_tax_id TEXT NOT NULL,
    shipping_address JSONB,
    status TEXT NOT NULL DEFAULT 'creating',
    payment_method TEXT,
    receipt_url TEXT,
    raw_response JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.payment_attempts ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.payment_attempts FROM anon;
REVOKE ALL ON TABLE public.payment_attempts FROM authenticated;
GRANT SELECT ON TABLE public.payment_attempts TO authenticated;

DROP POLICY IF EXISTS "Authenticated users can read own payment attempts" ON public.payment_attempts;
CREATE POLICY "Authenticated users can read own payment attempts" ON public.payment_attempts
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can manage payment attempts" ON public.payment_attempts;
CREATE POLICY "Admins can manage payment attempts" ON public.payment_attempts
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

CREATE OR REPLACE FUNCTION public.finalize_payment_order(
    p_provider TEXT,
    p_checkout_id TEXT,
    p_external_id TEXT,
    p_transaction_id TEXT,
    p_user_id UUID,
    p_total_amount NUMERIC,
    p_customer_email TEXT,
    p_customer_name TEXT,
    p_shipping_address JSONB,
    p_items JSONB,
    p_payment_method TEXT,
    p_payment_receipt_url TEXT,
    p_payment_raw_status TEXT
)
RETURNS TABLE(order_id UUID, action TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
    v_existing_order_id UUID;
    v_existing_item_count INTEGER := 0;
    v_order_id UUID;
    v_item RECORD;
    v_lock_key TEXT;
BEGIN
    IF p_provider IS NULL OR btrim(p_provider) = '' THEN
        RAISE EXCEPTION 'CHECKOUT_ITEMS_INVALID:Provedor de pagamento invalido.';
    END IF;

    IF p_external_id IS NULL OR btrim(p_external_id) = '' THEN
        RAISE EXCEPTION 'CHECKOUT_ITEMS_INVALID:Identificador externo invalido.';
    END IF;

    IF p_total_amount IS NULL OR p_total_amount < 0 THEN
        RAISE EXCEPTION 'CHECKOUT_ITEMS_INVALID:Total do pedido invalido.';
    END IF;

    IF p_items IS NULL OR jsonb_typeof(p_items) <> 'array' OR jsonb_array_length(p_items) = 0 THEN
        RAISE EXCEPTION 'CHECKOUT_ITEMS_INVALID:Itens confiaveis ausentes.';
    END IF;

    v_lock_key := p_provider || ':' || p_external_id;
    PERFORM pg_advisory_xact_lock(hashtextextended(v_lock_key, 0));

    SELECT id
    INTO v_existing_order_id
    FROM public.orders
    WHERE (payment_provider = p_provider AND payment_external_id = p_external_id)
       OR (
            p_checkout_id IS NOT NULL
            AND btrim(p_checkout_id) <> ''
            AND payment_provider = p_provider
            AND payment_checkout_id = p_checkout_id
       )
    FOR UPDATE;

    IF v_existing_order_id IS NOT NULL THEN
        SELECT COUNT(*)
        INTO v_existing_item_count
        FROM public.order_items
        WHERE order_id = v_existing_order_id;

        IF v_existing_item_count > 0 THEN
            RETURN QUERY
            SELECT v_existing_order_id, 'duplicate'::TEXT;
            RETURN;
        END IF;

        DELETE FROM public.orders
        WHERE id = v_existing_order_id;
    END IF;

    IF EXISTS (
        WITH parsed_items AS (
            SELECT
                (item.product_id)::UUID AS product_id,
                (item.variation_id)::UUID AS variation_id,
                item.quantity::INTEGER AS quantity,
                item.unit_price::NUMERIC AS unit_price
            FROM jsonb_to_recordset(p_items) AS item(
                product_id TEXT,
                variation_id TEXT,
                quantity INTEGER,
                unit_price NUMERIC
            )
        )
        SELECT 1
        FROM parsed_items
        WHERE product_id IS NULL
           OR variation_id IS NULL
           OR quantity IS NULL
           OR quantity <= 0
           OR unit_price IS NULL
           OR unit_price < 0
    ) THEN
        RAISE EXCEPTION 'CHECKOUT_ITEMS_INVALID:Itens do pedido invalidos.';
    END IF;

    IF EXISTS (
        WITH parsed_items AS (
            SELECT
                (item.product_id)::UUID AS product_id,
                (item.variation_id)::UUID AS variation_id,
                item.quantity::INTEGER AS quantity
            FROM jsonb_to_recordset(p_items) AS item(
                product_id TEXT,
                variation_id TEXT,
                quantity INTEGER,
                unit_price NUMERIC
            )
        ),
        aggregated_items AS (
            SELECT product_id, variation_id, SUM(quantity) AS quantity
            FROM parsed_items
            GROUP BY product_id, variation_id
        )
        SELECT 1
        FROM aggregated_items items
        LEFT JOIN public.products products
            ON products.id = items.product_id
        LEFT JOIN public.product_variations variations
            ON variations.id = items.variation_id
        WHERE products.id IS NULL
           OR variations.id IS NULL
           OR variations.product_id IS DISTINCT FROM items.product_id
    ) THEN
        RAISE EXCEPTION 'CHECKOUT_ITEM_INVALID:Produto ou variacao indisponivel para concluir o pedido.';
    END IF;

    FOR v_item IN
        WITH parsed_items AS (
            SELECT
                (item.product_id)::UUID AS product_id,
                (item.variation_id)::UUID AS variation_id,
                item.quantity::INTEGER AS quantity
            FROM jsonb_to_recordset(p_items) AS item(
                product_id TEXT,
                variation_id TEXT,
                quantity INTEGER,
                unit_price NUMERIC
            )
        ),
        aggregated_items AS (
            SELECT product_id, variation_id, SUM(quantity) AS quantity
            FROM parsed_items
            GROUP BY product_id, variation_id
        )
        SELECT
            items.product_id,
            items.variation_id,
            items.quantity,
            variations.stock_quantity
        FROM aggregated_items items
        JOIN public.product_variations variations
            ON variations.id = items.variation_id
        ORDER BY items.variation_id
        FOR UPDATE OF variations
    LOOP
        IF v_item.stock_quantity < v_item.quantity THEN
            RAISE EXCEPTION 'CHECKOUT_STOCK_CONFLICT:Estoque insuficiente para finalizar o pedido.';
        END IF;
    END LOOP;

    INSERT INTO public.orders (
        stripe_session_id,
        stripe_payment_intent_id,
        user_id,
        total_amount,
        status,
        customer_email,
        customer_name,
        shipping_address,
        payment_provider,
        payment_checkout_id,
        payment_external_id,
        payment_receipt_url,
        payment_method,
        payment_transaction_id,
        payment_raw_status
    )
    VALUES (
        NULL,
        NULL,
        p_user_id,
        ROUND(p_total_amount::NUMERIC, 2),
        'paid',
        NULLIF(btrim(COALESCE(p_customer_email, '')), ''),
        NULLIF(btrim(COALESCE(p_customer_name, '')), ''),
        p_shipping_address,
        p_provider,
        NULLIF(btrim(COALESCE(p_checkout_id, '')), ''),
        p_external_id,
        NULLIF(btrim(COALESCE(p_payment_receipt_url, '')), ''),
        NULLIF(btrim(COALESCE(p_payment_method, '')), ''),
        NULLIF(btrim(COALESCE(p_transaction_id, '')), ''),
        NULLIF(btrim(COALESCE(p_payment_raw_status, '')), '')
    )
    RETURNING id INTO v_order_id;

    INSERT INTO public.order_items (
        order_id,
        product_id,
        variation_id,
        quantity,
        price
    )
    WITH parsed_items AS (
        SELECT
            (item.product_id)::UUID AS product_id,
            (item.variation_id)::UUID AS variation_id,
            item.quantity::INTEGER AS quantity,
            item.unit_price::NUMERIC AS unit_price
        FROM jsonb_to_recordset(p_items) AS item(
            product_id TEXT,
            variation_id TEXT,
            quantity INTEGER,
            unit_price NUMERIC
        )
    ),
    aggregated_items AS (
        SELECT
            product_id,
            variation_id,
            SUM(quantity) AS quantity,
            MAX(unit_price) AS unit_price
        FROM parsed_items
        GROUP BY product_id, variation_id
    )
    SELECT
        v_order_id,
        product_id,
        variation_id,
        quantity,
        ROUND(unit_price::NUMERIC, 2)
    FROM aggregated_items;

    UPDATE public.product_variations variations
    SET stock_quantity = variations.stock_quantity - aggregated_items.quantity
    FROM (
        WITH parsed_items AS (
            SELECT
                (item.variation_id)::UUID AS variation_id,
                item.quantity::INTEGER AS quantity
            FROM jsonb_to_recordset(p_items) AS item(
                product_id TEXT,
                variation_id TEXT,
                quantity INTEGER,
                unit_price NUMERIC
            )
        )
        SELECT variation_id, SUM(quantity) AS quantity
        FROM parsed_items
        GROUP BY variation_id
    ) AS aggregated_items
    WHERE variations.id = aggregated_items.variation_id;

    RETURN QUERY
    SELECT
        v_order_id,
        CASE
            WHEN v_existing_order_id IS NULL THEN 'created'::TEXT
            ELSE 'recovered'::TEXT
        END;
END;
$function$;

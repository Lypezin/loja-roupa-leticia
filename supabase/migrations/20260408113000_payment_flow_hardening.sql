-- Harden Stripe checkout finalization and refund synchronization.

ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS stripe_payment_intent_id TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS orders_stripe_payment_intent_id_key
ON public.orders (stripe_payment_intent_id)
WHERE stripe_payment_intent_id IS NOT NULL;

DROP FUNCTION IF EXISTS public.finalize_checkout_order(TEXT, TEXT, UUID, NUMERIC, TEXT, TEXT, JSONB, JSONB);

CREATE OR REPLACE FUNCTION public.finalize_checkout_order(
    p_stripe_session_id TEXT,
    p_payment_intent_id TEXT,
    p_user_id UUID,
    p_total_amount NUMERIC,
    p_customer_email TEXT,
    p_customer_name TEXT,
    p_shipping_address JSONB,
    p_items JSONB
)
RETURNS TABLE(order_id UUID, action TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_existing_order_id UUID;
    v_existing_item_count INTEGER := 0;
    v_order_id UUID;
    v_item RECORD;
BEGIN
    IF p_stripe_session_id IS NULL OR btrim(p_stripe_session_id) = '' THEN
        RAISE EXCEPTION 'CHECKOUT_ITEMS_INVALID:Sessao Stripe invalida.';
    END IF;

    IF p_total_amount IS NULL OR p_total_amount < 0 THEN
        RAISE EXCEPTION 'CHECKOUT_ITEMS_INVALID:Total do pedido invalido.';
    END IF;

    IF p_items IS NULL OR jsonb_typeof(p_items) <> 'array' OR jsonb_array_length(p_items) = 0 THEN
        RAISE EXCEPTION 'CHECKOUT_ITEMS_INVALID:Itens confiaveis ausentes.';
    END IF;

    PERFORM pg_advisory_xact_lock(hashtextextended(p_stripe_session_id, 0));

    SELECT id
    INTO v_existing_order_id
    FROM public.orders
    WHERE stripe_session_id = p_stripe_session_id
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
        shipping_address
    )
    VALUES (
        p_stripe_session_id,
        NULLIF(btrim(COALESCE(p_payment_intent_id, '')), ''),
        p_user_id,
        ROUND(p_total_amount::NUMERIC, 2),
        'paid',
        NULLIF(btrim(COALESCE(p_customer_email, '')), ''),
        NULLIF(btrim(COALESCE(p_customer_name, '')), ''),
        p_shipping_address
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
$$;

REVOKE ALL ON FUNCTION public.finalize_checkout_order(TEXT, TEXT, UUID, NUMERIC, TEXT, TEXT, JSONB, JSONB) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.finalize_checkout_order(TEXT, TEXT, UUID, NUMERIC, TEXT, TEXT, JSONB, JSONB) FROM anon;
REVOKE ALL ON FUNCTION public.finalize_checkout_order(TEXT, TEXT, UUID, NUMERIC, TEXT, TEXT, JSONB, JSONB) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.finalize_checkout_order(TEXT, TEXT, UUID, NUMERIC, TEXT, TEXT, JSONB, JSONB) TO service_role;

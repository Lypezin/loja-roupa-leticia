ALTER TABLE public.shipping_integrations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS shipping_integrations_service_role_only ON public.shipping_integrations;
CREATE POLICY shipping_integrations_service_role_only
ON public.shipping_integrations
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "Public read product-images bucket" ON storage.objects;

WITH matched_attempts AS (
    SELECT
        o.id AS order_id,
        a.checkout_id,
        a.external_id,
        a.receipt_url,
        a.payment_method,
        a.status AS attempt_status,
        a.shipping_provider,
        a.shipping_service_id,
        a.shipping_service_name,
        a.shipping_company_name,
        a.shipping_cost,
        a.shipping_provider_cost,
        a.shipping_delivery_days,
        a.shipping_quote_payload,
        a.raw_response
    FROM public.orders AS o
    JOIN public.payment_attempts AS a
        ON a.provider = 'abacatepay'
       AND (
            (o.payment_external_id IS NOT NULL AND a.external_id = o.payment_external_id)
            OR (o.payment_checkout_id IS NOT NULL AND a.checkout_id = o.payment_checkout_id)
       )
    WHERE o.payment_provider = 'abacatepay'
)
UPDATE public.orders AS o
SET payment_transaction_id = COALESCE(
        NULLIF(BTRIM(o.payment_transaction_id), ''),
        NULLIF(BTRIM(m.checkout_id), ''),
        NULLIF(BTRIM(m.external_id), '')
    ),
    payment_receipt_url = COALESCE(
        NULLIF(BTRIM(o.payment_receipt_url), ''),
        NULLIF(BTRIM(m.receipt_url), ''),
        NULLIF(BTRIM(m.raw_response #>> '{data,payment,receiptUrl}'), ''),
        NULLIF(BTRIM(m.raw_response #>> '{data,billing,receiptUrl}'), ''),
        NULLIF(BTRIM(m.raw_response #>> '{receiptUrl}'), '')
    ),
    payment_method = COALESCE(
        NULLIF(BTRIM(o.payment_method), ''),
        NULLIF(BTRIM(m.payment_method), ''),
        NULLIF(BTRIM(m.raw_response #>> '{data,payment,method}'), '')
    ),
    payment_raw_status = COALESCE(
        NULLIF(BTRIM(o.payment_raw_status), ''),
        NULLIF(BTRIM(m.attempt_status), ''),
        NULLIF(BTRIM(m.raw_response #>> '{data,billing,status}'), '')
    ),
    shipping_provider = COALESCE(NULLIF(BTRIM(o.shipping_provider), ''), NULLIF(BTRIM(m.shipping_provider), '')),
    shipping_service_id = COALESCE(NULLIF(BTRIM(o.shipping_service_id), ''), NULLIF(BTRIM(m.shipping_service_id), '')),
    shipping_service_name = COALESCE(NULLIF(BTRIM(o.shipping_service_name), ''), NULLIF(BTRIM(m.shipping_service_name), '')),
    shipping_company_name = COALESCE(NULLIF(BTRIM(o.shipping_company_name), ''), NULLIF(BTRIM(m.shipping_company_name), '')),
    shipping_cost = COALESCE(o.shipping_cost, m.shipping_cost),
    shipping_provider_cost = COALESCE(o.shipping_provider_cost, m.shipping_provider_cost),
    shipping_delivery_days = COALESCE(o.shipping_delivery_days, m.shipping_delivery_days),
    shipping_quote_payload = COALESCE(o.shipping_quote_payload, m.shipping_quote_payload),
    updated_at = timezone('utc'::text, now())
FROM matched_attempts AS m
WHERE o.id = m.order_id
  AND (
        o.payment_transaction_id IS NULL
        OR BTRIM(o.payment_transaction_id) = ''
        OR o.payment_receipt_url IS NULL
        OR BTRIM(o.payment_receipt_url) = ''
        OR o.payment_method IS NULL
        OR BTRIM(o.payment_method) = ''
        OR o.payment_raw_status IS NULL
        OR BTRIM(o.payment_raw_status) = ''
        OR o.shipping_provider IS NULL
        OR BTRIM(o.shipping_provider) = ''
        OR o.shipping_service_id IS NULL
        OR BTRIM(o.shipping_service_id) = ''
        OR o.shipping_service_name IS NULL
        OR BTRIM(o.shipping_service_name) = ''
        OR o.shipping_company_name IS NULL
        OR BTRIM(o.shipping_company_name) = ''
        OR o.shipping_cost IS NULL
        OR o.shipping_provider_cost IS NULL
        OR o.shipping_delivery_days IS NULL
        OR o.shipping_quote_payload IS NULL
  );

WITH matched_attempts AS (
    SELECT
        o.id AS order_id,
        a.trusted_items::jsonb AS trusted_items
    FROM public.orders AS o
    JOIN public.payment_attempts AS a
        ON a.provider = 'abacatepay'
       AND (
            (o.payment_external_id IS NOT NULL AND a.external_id = o.payment_external_id)
            OR (o.payment_checkout_id IS NOT NULL AND a.checkout_id = o.payment_checkout_id)
       )
    WHERE o.payment_provider = 'abacatepay'
),
attempt_items AS (
    SELECT
        m.order_id,
        ROW_NUMBER() OVER (PARTITION BY m.order_id ORDER BY item.ordinality) AS item_index,
        NULLIF(BTRIM(item.value ->> 'product_id'), '')::uuid AS product_id,
        NULLIF(BTRIM(item.value ->> 'variation_id'), '')::uuid AS variation_id
    FROM matched_attempts AS m
    CROSS JOIN LATERAL jsonb_array_elements(m.trusted_items) WITH ORDINALITY AS item(value, ordinality)
),
existing_products AS (
    SELECT id FROM public.products
),
existing_variations AS (
    SELECT id FROM public.product_variations
),
ordered_items AS (
    SELECT
        oi.id,
        oi.order_id,
        ROW_NUMBER() OVER (PARTITION BY oi.order_id ORDER BY oi.created_at, oi.id) AS item_index
    FROM public.order_items AS oi
    JOIN public.orders AS o
      ON o.id = oi.order_id
    WHERE o.payment_provider = 'abacatepay'
)
UPDATE public.order_items AS oi
SET product_id = COALESCE(oi.product_id, ep.id),
    variation_id = COALESCE(oi.variation_id, ev.id)
FROM ordered_items AS ordered
JOIN attempt_items AS ai
  ON ai.order_id = ordered.order_id
 AND ai.item_index = ordered.item_index
LEFT JOIN existing_products AS ep
  ON ep.id = ai.product_id
LEFT JOIN existing_variations AS ev
  ON ev.id = ai.variation_id
WHERE oi.id = ordered.id
  AND (
        (oi.product_id IS NULL AND ep.id IS NOT NULL)
        OR (oi.variation_id IS NULL AND ev.id IS NOT NULL)
  );

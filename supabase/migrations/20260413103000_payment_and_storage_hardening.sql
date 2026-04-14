ALTER TABLE public.shipping_integrations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS shipping_integrations_service_role_only ON public.shipping_integrations;
CREATE POLICY shipping_integrations_service_role_only
ON public.shipping_integrations
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "Public read product-images bucket" ON storage.objects;

UPDATE public.orders AS o
SET payment_transaction_id = COALESCE(
        NULLIF(BTRIM(o.payment_transaction_id), ''),
        NULLIF(BTRIM(o.payment_checkout_id), '')
    ),
    payment_receipt_url = COALESCE(
        NULLIF(BTRIM(o.payment_receipt_url), ''),
        NULLIF(BTRIM(a.receipt_url), '')
    ),
    updated_at = timezone('utc'::text, now())
FROM public.payment_attempts AS a
WHERE o.payment_provider = 'abacatepay'
  AND a.provider = 'abacatepay'
  AND (
    (o.payment_external_id IS NOT NULL AND a.external_id = o.payment_external_id)
    OR (o.payment_checkout_id IS NOT NULL AND a.checkout_id = o.payment_checkout_id)
  )
  AND (
    o.payment_transaction_id IS NULL
    OR BTRIM(o.payment_transaction_id) = ''
    OR o.payment_receipt_url IS NULL
    OR BTRIM(o.payment_receipt_url) = ''
  );

CREATE OR REPLACE FUNCTION public.hydrate_abacatepay_order_metadata()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
    v_attempt public.payment_attempts%ROWTYPE;
BEGIN
    IF NEW.payment_provider IS DISTINCT FROM 'abacatepay' THEN
        RETURN NEW;
    END IF;

    SELECT *
    INTO v_attempt
    FROM public.payment_attempts
    WHERE provider = 'abacatepay'
      AND (
        (NEW.payment_external_id IS NOT NULL AND external_id = NEW.payment_external_id)
        OR (NEW.payment_checkout_id IS NOT NULL AND checkout_id = NEW.payment_checkout_id)
      )
    ORDER BY updated_at DESC NULLS LAST, created_at DESC
    LIMIT 1;

    IF NOT FOUND THEN
        RETURN NEW;
    END IF;

    UPDATE public.orders AS o
    SET payment_method = COALESCE(NULLIF(BTRIM(o.payment_method), ''), NULLIF(BTRIM(v_attempt.payment_method), '')),
        payment_receipt_url = COALESCE(NULLIF(BTRIM(o.payment_receipt_url), ''), NULLIF(BTRIM(v_attempt.receipt_url), '')),
        customer_email = COALESCE(NULLIF(BTRIM(o.customer_email), ''), NULLIF(BTRIM(v_attempt.customer_email), '')),
        customer_name = COALESCE(NULLIF(BTRIM(o.customer_name), ''), NULLIF(BTRIM(v_attempt.customer_name), '')),
        payment_raw_status = COALESCE(NULLIF(BTRIM(o.payment_raw_status), ''), NULLIF(BTRIM(v_attempt.status), '')),
        shipping_provider = COALESCE(NULLIF(BTRIM(o.shipping_provider), ''), NULLIF(BTRIM(v_attempt.shipping_provider), '')),
        shipping_service_id = COALESCE(NULLIF(BTRIM(o.shipping_service_id), ''), NULLIF(BTRIM(v_attempt.shipping_service_id), '')),
        shipping_service_name = COALESCE(NULLIF(BTRIM(o.shipping_service_name), ''), NULLIF(BTRIM(v_attempt.shipping_service_name), '')),
        shipping_company_name = COALESCE(NULLIF(BTRIM(o.shipping_company_name), ''), NULLIF(BTRIM(v_attempt.shipping_company_name), '')),
        shipping_cost = COALESCE(o.shipping_cost, v_attempt.shipping_cost),
        shipping_provider_cost = COALESCE(o.shipping_provider_cost, v_attempt.shipping_provider_cost),
        shipping_delivery_days = COALESCE(o.shipping_delivery_days, v_attempt.shipping_delivery_days),
        shipping_quote_payload = COALESCE(o.shipping_quote_payload, v_attempt.shipping_quote_payload),
        updated_at = timezone('utc'::text, now())
    WHERE o.id = NEW.id;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS orders_hydrate_abacatepay_metadata ON public.orders;
CREATE TRIGGER orders_hydrate_abacatepay_metadata
AFTER INSERT ON public.orders
FOR EACH ROW
WHEN (NEW.payment_provider = 'abacatepay')
EXECUTE FUNCTION public.hydrate_abacatepay_order_metadata();

CREATE TABLE IF NOT EXISTS public.shipping_integrations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    provider TEXT NOT NULL,
    environment TEXT NOT NULL,
    access_token TEXT NOT NULL,
    refresh_token TEXT NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    token_type TEXT,
    scope TEXT,
    account_email TEXT,
    account_name TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS shipping_integrations_provider_environment_unique
    ON public.shipping_integrations (provider, environment);

ALTER TABLE public.shipping_integrations ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.shipping_integrations FROM PUBLIC;
REVOKE ALL ON TABLE public.shipping_integrations FROM anon;
REVOKE ALL ON TABLE public.shipping_integrations FROM authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.shipping_integrations TO service_role;

ALTER TABLE public.products
    ADD COLUMN IF NOT EXISTS weight_kg NUMERIC(10, 3),
    ADD COLUMN IF NOT EXISTS length_cm NUMERIC(10, 2),
    ADD COLUMN IF NOT EXISTS width_cm NUMERIC(10, 2),
    ADD COLUMN IF NOT EXISTS height_cm NUMERIC(10, 2);

ALTER TABLE public.payment_attempts
    ADD COLUMN IF NOT EXISTS shipping_provider TEXT,
    ADD COLUMN IF NOT EXISTS shipping_service_id TEXT,
    ADD COLUMN IF NOT EXISTS shipping_service_name TEXT,
    ADD COLUMN IF NOT EXISTS shipping_company_name TEXT,
    ADD COLUMN IF NOT EXISTS shipping_cost NUMERIC(10, 2),
    ADD COLUMN IF NOT EXISTS shipping_provider_cost NUMERIC(10, 2),
    ADD COLUMN IF NOT EXISTS shipping_delivery_days INTEGER,
    ADD COLUMN IF NOT EXISTS shipping_quote_payload JSONB;

ALTER TABLE public.orders
    ADD COLUMN IF NOT EXISTS shipping_provider TEXT,
    ADD COLUMN IF NOT EXISTS shipping_service_id TEXT,
    ADD COLUMN IF NOT EXISTS shipping_service_name TEXT,
    ADD COLUMN IF NOT EXISTS shipping_company_name TEXT,
    ADD COLUMN IF NOT EXISTS shipping_cost NUMERIC(10, 2),
    ADD COLUMN IF NOT EXISTS shipping_provider_cost NUMERIC(10, 2),
    ADD COLUMN IF NOT EXISTS shipping_delivery_days INTEGER,
    ADD COLUMN IF NOT EXISTS shipping_quote_payload JSONB;

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
        shipping_provider = COALESCE(NULLIF(BTRIM(o.shipping_provider), ''), NULLIF(BTRIM(NEW.shipping_provider), '')),
        shipping_service_id = COALESCE(NULLIF(BTRIM(o.shipping_service_id), ''), NULLIF(BTRIM(NEW.shipping_service_id), '')),
        shipping_service_name = COALESCE(NULLIF(BTRIM(o.shipping_service_name), ''), NULLIF(BTRIM(NEW.shipping_service_name), '')),
        shipping_company_name = COALESCE(NULLIF(BTRIM(o.shipping_company_name), ''), NULLIF(BTRIM(NEW.shipping_company_name), '')),
        shipping_cost = COALESCE(o.shipping_cost, NEW.shipping_cost),
        shipping_provider_cost = COALESCE(o.shipping_provider_cost, NEW.shipping_provider_cost),
        shipping_delivery_days = COALESCE(o.shipping_delivery_days, NEW.shipping_delivery_days),
        shipping_quote_payload = COALESCE(o.shipping_quote_payload, NEW.shipping_quote_payload),
        updated_at = timezone('utc'::text, now())
    WHERE o.payment_provider = 'abacatepay'
      AND (
        (v_external_id IS NOT NULL AND o.payment_external_id = v_external_id)
        OR (v_checkout_id IS NOT NULL AND o.payment_checkout_id = v_checkout_id)
      );

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS payment_attempts_sync_abacatepay_order ON public.payment_attempts;
CREATE TRIGGER payment_attempts_sync_abacatepay_order
AFTER INSERT OR UPDATE OF status, raw_response, payment_method, receipt_url, checkout_id, external_id, customer_email, customer_name, shipping_provider, shipping_service_id, shipping_service_name, shipping_company_name, shipping_cost, shipping_provider_cost, shipping_delivery_days, shipping_quote_payload
ON public.payment_attempts
FOR EACH ROW
WHEN (NEW.provider = 'abacatepay')
EXECUTE FUNCTION public.sync_abacatepay_order_metadata();

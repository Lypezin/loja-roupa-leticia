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

DROP TRIGGER IF EXISTS payment_attempts_normalize_abacatepay_metadata ON public.payment_attempts;
CREATE TRIGGER payment_attempts_normalize_abacatepay_metadata
BEFORE INSERT OR UPDATE OF raw_response, payment_method, receipt_url, checkout_id, external_id, customer_email, customer_name
ON public.payment_attempts
FOR EACH ROW
WHEN (NEW.provider = 'abacatepay')
EXECUTE FUNCTION public.normalize_abacatepay_attempt_metadata();

DROP TRIGGER IF EXISTS payment_attempts_sync_abacatepay_order ON public.payment_attempts;
CREATE TRIGGER payment_attempts_sync_abacatepay_order
AFTER INSERT OR UPDATE OF status, raw_response, payment_method, receipt_url, checkout_id, external_id, customer_email, customer_name, shipping_provider, shipping_service_id, shipping_service_name, shipping_company_name, shipping_cost, shipping_provider_cost, shipping_delivery_days, shipping_quote_payload
ON public.payment_attempts
FOR EACH ROW
WHEN (NEW.provider = 'abacatepay')
EXECUTE FUNCTION public.sync_abacatepay_order_metadata();

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

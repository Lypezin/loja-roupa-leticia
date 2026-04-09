CREATE OR REPLACE FUNCTION public.jsonb_text_array_to_csv(p_value JSONB)
RETURNS TEXT
LANGUAGE sql
IMMUTABLE
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

DROP TRIGGER IF EXISTS payment_attempts_normalize_abacatepay_metadata ON public.payment_attempts;
CREATE TRIGGER payment_attempts_normalize_abacatepay_metadata
BEFORE INSERT OR UPDATE OF raw_response, payment_method, receipt_url, checkout_id, external_id, customer_email, customer_name
ON public.payment_attempts
FOR EACH ROW
WHEN (NEW.provider = 'abacatepay')
EXECUTE FUNCTION public.normalize_abacatepay_attempt_metadata();

DROP TRIGGER IF EXISTS payment_attempts_sync_abacatepay_order ON public.payment_attempts;
CREATE TRIGGER payment_attempts_sync_abacatepay_order
AFTER INSERT OR UPDATE OF status, raw_response, payment_method, receipt_url, checkout_id, external_id, customer_email, customer_name
ON public.payment_attempts
FOR EACH ROW
WHEN (NEW.provider = 'abacatepay')
EXECUTE FUNCTION public.sync_abacatepay_order_metadata();

ALTER TABLE public.store_settings
    ADD COLUMN IF NOT EXISTS shipping_sender_name TEXT,
    ADD COLUMN IF NOT EXISTS shipping_sender_email TEXT,
    ADD COLUMN IF NOT EXISTS shipping_sender_phone TEXT,
    ADD COLUMN IF NOT EXISTS shipping_sender_document TEXT,
    ADD COLUMN IF NOT EXISTS shipping_sender_state_register TEXT,
    ADD COLUMN IF NOT EXISTS shipping_sender_address TEXT,
    ADD COLUMN IF NOT EXISTS shipping_sender_number TEXT,
    ADD COLUMN IF NOT EXISTS shipping_sender_district TEXT,
    ADD COLUMN IF NOT EXISTS shipping_sender_city TEXT,
    ADD COLUMN IF NOT EXISTS shipping_sender_state TEXT,
    ADD COLUMN IF NOT EXISTS shipping_sender_complement TEXT,
    ADD COLUMN IF NOT EXISTS shipping_sender_non_commercial BOOLEAN DEFAULT true;

ALTER TABLE public.orders
    ADD COLUMN IF NOT EXISTS shipping_external_id TEXT,
    ADD COLUMN IF NOT EXISTS shipping_external_protocol TEXT,
    ADD COLUMN IF NOT EXISTS shipping_status_detail TEXT,
    ADD COLUMN IF NOT EXISTS shipping_tracking_code TEXT,
    ADD COLUMN IF NOT EXISTS shipping_tracking_url TEXT,
    ADD COLUMN IF NOT EXISTS shipping_label_url TEXT,
    ADD COLUMN IF NOT EXISTS shipping_payload JSONB,
    ADD COLUMN IF NOT EXISTS shipping_created_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS shipping_paid_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS shipping_generated_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS shipping_posted_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS shipping_delivered_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS shipping_canceled_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS shipping_last_synced_at TIMESTAMPTZ;

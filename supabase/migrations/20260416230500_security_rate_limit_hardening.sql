CREATE TABLE IF NOT EXISTS public.request_rate_limits (
    key TEXT PRIMARY KEY,
    scope TEXT NOT NULL,
    attempts INTEGER NOT NULL DEFAULT 0,
    window_started_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    blocked_until TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_request_rate_limits_scope_updated_at
    ON public.request_rate_limits (scope, updated_at DESC);

ALTER TABLE public.request_rate_limits ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.request_rate_limits FROM PUBLIC;
REVOKE ALL ON TABLE public.request_rate_limits FROM anon;
REVOKE ALL ON TABLE public.request_rate_limits FROM authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.request_rate_limits TO service_role;

DROP POLICY IF EXISTS request_rate_limits_service_role_only ON public.request_rate_limits;
CREATE POLICY request_rate_limits_service_role_only
ON public.request_rate_limits
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

CREATE OR REPLACE FUNCTION public.consume_rate_limit(
    p_scope TEXT,
    p_identifier_hash TEXT,
    p_max_attempts INTEGER,
    p_window_seconds INTEGER,
    p_block_seconds INTEGER DEFAULT NULL
)
RETURNS TABLE(
    allowed BOOLEAN,
    retry_after_seconds INTEGER,
    remaining INTEGER,
    reset_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_key TEXT;
    v_now TIMESTAMPTZ := timezone('utc'::text, now());
    v_window_interval INTERVAL;
    v_block_interval INTERVAL;
    v_row public.request_rate_limits%ROWTYPE;
BEGIN
    IF COALESCE(BTRIM(p_scope), '') = '' OR COALESCE(BTRIM(p_identifier_hash), '') = '' THEN
        RAISE EXCEPTION 'RATE_LIMIT_INVALID:Escopo ou identificador ausente.';
    END IF;

    IF p_max_attempts IS NULL OR p_max_attempts <= 0 OR p_window_seconds IS NULL OR p_window_seconds <= 0 THEN
        RAISE EXCEPTION 'RATE_LIMIT_INVALID:Configuracao de limite invalida.';
    END IF;

    v_key := p_scope || ':' || p_identifier_hash;
    v_window_interval := make_interval(secs => p_window_seconds);
    v_block_interval := make_interval(secs => GREATEST(COALESCE(p_block_seconds, p_window_seconds), 1));

    PERFORM pg_advisory_xact_lock(hashtextextended(v_key, 0));

    SELECT *
    INTO v_row
    FROM public.request_rate_limits
    WHERE key = v_key
    FOR UPDATE;

    IF NOT FOUND THEN
        INSERT INTO public.request_rate_limits (
            key,
            scope,
            attempts,
            window_started_at,
            blocked_until,
            created_at,
            updated_at
        )
        VALUES (
            v_key,
            p_scope,
            1,
            v_now,
            NULL,
            v_now,
            v_now
        );

        RETURN QUERY
        SELECT TRUE, 0, GREATEST(p_max_attempts - 1, 0), v_now + v_window_interval;
        RETURN;
    END IF;

    IF v_row.blocked_until IS NOT NULL AND v_row.blocked_until > v_now THEN
        RETURN QUERY
        SELECT FALSE, GREATEST(CEIL(EXTRACT(EPOCH FROM (v_row.blocked_until - v_now)))::INTEGER, 1), 0, v_row.blocked_until;
        RETURN;
    END IF;

    IF v_row.window_started_at + v_window_interval <= v_now THEN
        UPDATE public.request_rate_limits
        SET attempts = 1,
            window_started_at = v_now,
            blocked_until = NULL,
            updated_at = v_now
        WHERE key = v_key;

        RETURN QUERY
        SELECT TRUE, 0, GREATEST(p_max_attempts - 1, 0), v_now + v_window_interval;
        RETURN;
    END IF;

    v_row.attempts := v_row.attempts + 1;

    IF v_row.attempts > p_max_attempts THEN
        UPDATE public.request_rate_limits
        SET attempts = v_row.attempts,
            blocked_until = v_now + v_block_interval,
            updated_at = v_now
        WHERE key = v_key;

        RETURN QUERY
        SELECT FALSE, GREATEST(CEIL(EXTRACT(EPOCH FROM v_block_interval))::INTEGER, 1), 0, v_now + v_block_interval;
        RETURN;
    END IF;

    UPDATE public.request_rate_limits
    SET attempts = v_row.attempts,
        updated_at = v_now
    WHERE key = v_key;

    RETURN QUERY
    SELECT TRUE, 0, GREATEST(p_max_attempts - v_row.attempts, 0), v_row.window_started_at + v_window_interval;
END;
$$;

REVOKE ALL ON FUNCTION public.consume_rate_limit(TEXT, TEXT, INTEGER, INTEGER, INTEGER) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.consume_rate_limit(TEXT, TEXT, INTEGER, INTEGER, INTEGER) FROM anon;
REVOKE ALL ON FUNCTION public.consume_rate_limit(TEXT, TEXT, INTEGER, INTEGER, INTEGER) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.consume_rate_limit(TEXT, TEXT, INTEGER, INTEGER, INTEGER) TO service_role;

CREATE OR REPLACE FUNCTION public.slugify_product_name(input TEXT)
RETURNS TEXT
LANGUAGE sql
IMMUTABLE
SET search_path = public
AS $$
    SELECT COALESCE(
        NULLIF(
            trim(
                BOTH '-'
                FROM regexp_replace(
                    translate(
                        lower(COALESCE(input, '')),
                        'áàâãäåéèêẽëíìîĩïóòôõöúùûũüçñ',
                        'aaaaaaeeeeeiiiiiooooouuuuucn'
                    ),
                    '[^a-z0-9]+',
                    '-',
                    'g'
                )
            ),
            ''
        ),
        'produto'
    );
$$;

CREATE OR REPLACE FUNCTION public.ensure_product_slug()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
    base_slug TEXT;
    candidate_slug TEXT;
    suffix INTEGER := 1;
BEGIN
    IF NEW.slug IS NOT NULL AND BTRIM(NEW.slug) <> '' THEN
        base_slug := public.slugify_product_name(NEW.slug);
    ELSE
        base_slug := public.slugify_product_name(NEW.name);
    END IF;

    PERFORM pg_advisory_xact_lock(hashtextextended(base_slug, 0));

    candidate_slug := base_slug;

    WHILE EXISTS (
        SELECT 1
        FROM public.products AS existing_product
        WHERE existing_product.slug = candidate_slug
          AND existing_product.id IS DISTINCT FROM NEW.id
    ) LOOP
        suffix := suffix + 1;
        candidate_slug := base_slug || '-' || suffix::TEXT;
    END LOOP;

    NEW.slug := candidate_slug;
    RETURN NEW;
END;
$$;

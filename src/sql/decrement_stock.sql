-- Funcao RPC para decrementar o estoque de uma variacao.
-- O webhook de pagamento e o unico fluxo de aplicacao autorizado a executa-la.
DROP FUNCTION IF EXISTS public.decrement_stock(UUID, INT);

CREATE OR REPLACE FUNCTION public.decrement_stock(p_variation_id UUID, p_quantity INT)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    updated_rows INT;
BEGIN
    IF p_quantity IS NULL OR p_quantity <= 0 THEN
        RETURN false;
    END IF;

    UPDATE public.product_variations
    SET stock_quantity = stock_quantity - p_quantity
    WHERE id = p_variation_id
      AND stock_quantity >= p_quantity;

    GET DIAGNOSTICS updated_rows = ROW_COUNT;
    RETURN updated_rows = 1;
END;
$$;

REVOKE ALL ON FUNCTION public.decrement_stock(UUID, INT) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.decrement_stock(UUID, INT) FROM anon;
REVOKE ALL ON FUNCTION public.decrement_stock(UUID, INT) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.decrement_stock(UUID, INT) TO service_role;

-- Funcao RPC para decrementar o estoque de uma variacao.
-- Ela impede que o estoque fique negativo e informa se a baixa foi aplicada.
CREATE OR REPLACE FUNCTION public.decrement_stock(p_variation_id UUID, p_quantity INT)
RETURNS boolean AS $$
DECLARE
    updated_rows INT;
BEGIN
    UPDATE public.product_variations
    SET stock_quantity = stock_quantity - p_quantity
    WHERE id = p_variation_id
      AND p_quantity > 0
      AND stock_quantity >= p_quantity;

    GET DIAGNOSTICS updated_rows = ROW_COUNT;
    RETURN updated_rows = 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

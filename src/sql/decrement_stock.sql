-- Função RPC para decrementar o estoque de uma variação
-- Ela impede que o estoque fique negativo
CREATE OR REPLACE FUNCTION public.decrement_stock(p_variation_id UUID, p_quantity INT)
RETURNS void AS $$
BEGIN
    UPDATE public.product_variations
    SET stock = GREATEST(stock - p_quantity, 0)
    WHERE id = p_variation_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

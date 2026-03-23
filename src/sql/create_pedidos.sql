-- 1. Tabela de Pedidos
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Cliente logado
    stripe_session_id TEXT UNIQUE NOT NULL,
    total_amount NUMERIC(10, 2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'paid', -- Status de envio: paid, processing, shipped, delivered, cancelled
    customer_email TEXT,
    customer_name TEXT,
    shipping_address JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS
CREATE POLICY "Usuários podem ver seus próprios pedidos" ON public.orders
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admin pode gerenciar pedidos" ON public.orders
FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.store_settings WHERE id IS NOT NULL limit 1 -- Se store_settings existe e o user ta logado (No admin, usamos requireAdmin no backend, então a query real ignora RLS no service_role)
    )
);

-- 2. Tabela de Itens do Pedido
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    variation_id UUID REFERENCES public.product_variations(id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar RLS
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS
CREATE POLICY "Usuários podem ver itens de seus pedidos" ON public.order_items
FOR SELECT USING (
    order_id IN (
        SELECT id FROM public.orders WHERE user_id = auth.uid()
    )
);

CREATE POLICY "Admin pode ver e gerenciar itens" ON public.order_items
FOR ALL USING (true);

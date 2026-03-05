-- ==========================================
-- E-COMMERCE SUPABASE SCHEMA & RLS SETUP
-- ==========================================

-- 1. Criação das Tabelas Base
-- ------------------------------------------

CREATE TABLE store_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_name TEXT NOT NULL DEFAULT 'Minha Loja',
  store_description TEXT,
  support_email TEXT,
  whatsapp_number TEXT,
  instagram_url TEXT,
  free_shipping_threshold DECIMAL(10,2),
  shipping_origin_zip TEXT,
  processing_days INTEGER DEFAULT 2,
  hero_title TEXT,
  hero_subtitle TEXT,
  hero_button_text TEXT,
  hero_image_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  base_price DECIMAL(10,2) NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE product_variations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  size TEXT NOT NULL,      -- Ex: P, M, G
  color TEXT NOT NULL,     -- Ex: Preto, Branco
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  sku TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL, -- Caminho do Supabase Storage
  is_primary BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_email TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, paid, shipped, canceled
  total_amount DECIMAL(10,2) NOT NULL,
  shipping_fee DECIMAL(10,2) DEFAULT 0.00,
  tracking_code TEXT,
  payment_session_id TEXT, -- ID do Stripe/MercadoPago
  shipping_address JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_variation_id UUID REFERENCES product_variations(id) ON DELETE RESTRICT,
  quantity INTEGER NOT NULL,
  price_at_time DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- 2. Configurações de Storage (Bucket para fotos)
-- ==========================================
insert into storage.buckets (id, name, public) values ('product-images', 'product-images', true);


-- ==========================================
-- 3. Row Level Security (RLS) - POLÍTICAS
-- ==========================================
-- Habilitar RLS em todas as tabelas
ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variations ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------
-- Políticas PÚBLICAS (Qualquer visitante pode ver a loja)
-- ----------------------------------------------------
CREATE POLICY "Vitrine Pública Configurações" ON store_settings FOR SELECT USING (true);
CREATE POLICY "Vitrine Pública Categorias" ON categories FOR SELECT USING (true);
CREATE POLICY "Vitrine Pública Produtos Ativos" ON products FOR SELECT USING (is_active = true);
-- Todos podem ver variações e imagens dos produtos (joins)
CREATE POLICY "Vitrine Pública Variações" ON product_variations FOR SELECT USING (true);
CREATE POLICY "Vitrine Pública Imagens" ON product_images FOR SELECT USING (true);

-- ----------------------------------------------------
-- Políticas ADMIN (Dono da Loja - Acesso Total)
-- O cliente precisa ter logado com email/senha (auth.uid())
-- ----------------------------------------------------
CREATE POLICY "Admin CRUD Configurações" ON store_settings FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin CRUD Categorias" ON categories FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin CRUD Produtos" ON products FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin CRUD Variações" ON product_variations FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin CRUD Imagens" ON product_images FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin CRUD Orders" ON orders FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin CRUD Order Items" ON order_items FOR ALL USING (auth.role() = 'authenticated');

-- Permitir Auth Users gerenciar fotos no bucket (Upload/Delete)
create policy "Admin gerencia imagens"
  on storage.objects for all
  using ( bucket_id = 'product-images' AND auth.role() = 'authenticated' );

-- Permitir Public ver fotos no bucket
create policy "Public ve imagens"
  on storage.objects for select
  using ( bucket_id = 'product-images' );

-- Insert inicial pra travar numa linha de conf apenas.
INSERT INTO store_settings (store_name) VALUES ('Loja de Roupas Premium');

-- ==========================================
-- FIM DO SCRIPT
-- ==========================================

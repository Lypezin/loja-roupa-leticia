-- Migração: Adicionar colunas de configuração do Rodapé
-- Execute este SQL no Supabase Dashboard > SQL Editor

ALTER TABLE store_settings 
ADD COLUMN IF NOT EXISTS footer_about_text TEXT DEFAULT 'Peças exclusivas com qualidade premium. Fazemos moda que conta histórias.',
ADD COLUMN IF NOT EXISTS footer_newsletter_title TEXT DEFAULT 'Fique por dentro',
ADD COLUMN IF NOT EXISTS footer_newsletter_subtitle TEXT DEFAULT 'Receba novidades e ofertas exclusivas.';

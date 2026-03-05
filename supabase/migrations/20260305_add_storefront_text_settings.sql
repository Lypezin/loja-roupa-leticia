-- Add new editable sections to store_settings
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS hero_badge_text text DEFAULT 'Nova Coleção 2025';
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS hero_secondary_button_text text DEFAULT 'Conheça a marca';
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS products_section_label text DEFAULT 'Novidades';
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS products_section_title text DEFAULT 'Lançamentos';
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS categories_section_label text DEFAULT 'Coleções';
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS categories_section_title text DEFAULT 'Explore por Categoria';

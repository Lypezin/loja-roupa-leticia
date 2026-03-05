// Run migration via Supabase Management API
const projectRef = 'jvpjvpncoanraulxihrf'

async function migrate() {
    const sql = `
        ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS hero_badge_text text DEFAULT 'Nova Coleção 2025';
        ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS hero_secondary_button_text text DEFAULT 'Conheça a marca';
        ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS products_section_label text DEFAULT 'Novidades';
        ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS products_section_title text DEFAULT 'Lançamentos';
        ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS categories_section_label text DEFAULT 'Coleções';
        ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS categories_section_title text DEFAULT 'Explore por Categoria';
    `

    // Use pg with URL-encoded password
    const { Client } = require('pg')
    const client = new Client({
        host: 'aws-0-sa-east-1.pooler.supabase.com',
        port: 6543,
        database: 'postgres',
        user: 'postgres.jvpjvpncoanraulxihrf',
        password: 'Brasil2025!!',
        ssl: { rejectUnauthorized: false }
    })

    try {
        await client.connect()
        console.log('Connected!')
        await client.query(sql)
        console.log('Migration completed successfully!')

        const result = await client.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'store_settings' ORDER BY ordinal_position")
        console.log('Columns:', result.rows.map(r => r.column_name).join(', '))
    } catch (err) {
        console.error('Error:', err.message)
    } finally {
        await client.end()
    }
}

migrate()

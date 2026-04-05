import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const supabase = await createClient()
    const baseUrl = 'https://loja-roupa.vercel.app'

    // 1. Buscar Categorias
    const { data: categories } = await supabase.from('categories').select('slug, updated_at')

    // 2. Buscar Produtos
    const { data: products } = await supabase
        .from('products')
        .select('id, updated_at')
        .eq('is_active', true)

    const categoryEntries = (categories || []).map((cat) => ({
        url: `${baseUrl}/${cat.slug}`,
        lastModified: cat.updated_at ? new Date(cat.updated_at) : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }))

    const productEntries = (products || []).map((prod) => ({
        url: `${baseUrl}/produto/${prod.id}`,
        lastModified: prod.updated_at ? new Date(prod.updated_at) : new Date(),
        changeFrequency: 'daily' as const,
        priority: 1,
    }))

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 1,
        },
        ...categoryEntries,
        ...productEntries,
    ]
}

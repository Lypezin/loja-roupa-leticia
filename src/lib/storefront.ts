import { unstable_cache } from 'next/cache'
import type { Database } from '@/lib/supabase/database.types'
import { createPublicClient } from '@/lib/supabase/public'

export type StoreSettings = Database['public']['Tables']['store_settings']['Row']
export type StoreCategory = Pick<Database['public']['Tables']['categories']['Row'], 'id' | 'name' | 'slug' | 'image_url' | 'created_at'>

export const getStoreSettings = unstable_cache(async () => {
    const supabase = createPublicClient()
    const { data } = await supabase.from('store_settings').select('*').single()
    return data as StoreSettings | null
}, ['store-settings'], { revalidate: 60 })

export const getStoreCategories = unstable_cache(async () => {
    const supabase = createPublicClient()
    const { data } = await supabase
        .from('categories')
        .select('id, name, slug, image_url, created_at')
        .order('created_at', { ascending: true })

    return (data ?? []) as StoreCategory[]
}, ['store-categories'], { revalidate: 60 })

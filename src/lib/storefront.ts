import { cache } from 'react'
import type { Database } from '@/lib/supabase/database.types'
import { createClient } from '@/lib/supabase/server'

export type StoreSettings = Database['public']['Tables']['store_settings']['Row']
export type StoreCategory = Pick<Database['public']['Tables']['categories']['Row'], 'id' | 'name' | 'slug' | 'image_url' | 'created_at'>

export const getStoreSettings = cache(async () => {
    const supabase = await createClient()
    const { data } = await supabase.from('store_settings').select('*').single()
    return data as StoreSettings | null
})

export const getStoreCategories = cache(async () => {
    const supabase = await createClient()
    const { data } = await supabase
        .from('categories')
        .select('id, name, slug, image_url, created_at')
        .order('created_at', { ascending: true })

    return (data ?? []) as StoreCategory[]
})

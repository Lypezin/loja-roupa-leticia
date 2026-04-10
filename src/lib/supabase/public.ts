import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

let cachedPublicClient: ReturnType<typeof createSupabaseClient<Database>> | null = null

function getPublicConfig() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl) {
        throw new Error('NEXT_PUBLIC_SUPABASE_URL ausente.')
    }

    if (!anonKey) {
        throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY ausente.')
    }

    return { supabaseUrl, anonKey }
}

export function createPublicClient() {
    const { supabaseUrl, anonKey } = getPublicConfig()

    if (!cachedPublicClient) {
        cachedPublicClient = createSupabaseClient<Database>(supabaseUrl, anonKey, {
            auth: {
                autoRefreshToken: false,
                persistSession: false,
            },
        })
    }

    return cachedPublicClient
}

import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

let cachedClient: ReturnType<typeof createClient<Database>> | null = null

function getServiceRoleConfig() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl) {
        throw new Error('NEXT_PUBLIC_SUPABASE_URL ausente.')
    }

    if (!serviceRoleKey) {
        throw new Error('SUPABASE_SERVICE_ROLE_KEY ausente.')
    }

    return { supabaseUrl, serviceRoleKey }
}

export function createServiceRoleClient(context: string) {
    const { supabaseUrl, serviceRoleKey } = getServiceRoleConfig()

    if (!cachedClient) {
        cachedClient = createClient<Database>(supabaseUrl, serviceRoleKey, {
            auth: {
                autoRefreshToken: false,
                persistSession: false,
            },
        })
    }

    if (process.env.NODE_ENV !== 'production') {
        console.info(`[supabase-service-role] ${context}`)
    }

    return cachedClient
}

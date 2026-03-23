import { createClient } from './src/lib/supabase/client'
require('dotenv').config({ path: '.env.local' })

async function test() {
    const { createClient } = require('@supabase/supabase-js')
    const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )

    console.log("Fetching orders from Admin...")
    const { data: orders, error } = await supabaseAdmin
        .from('orders')
        .select(`
            *,
            users ( full_name, email ),
            order_items (
                id,
                quantity,
                price,
                products ( name )
            )
        `)
        .order('created_at', { ascending: false })
    
    console.log("Admin Query Result:", { error: error?.message, count: orders?.length })

    console.log("\nFetching orders purely to see if they exist...")
    const { data: rawOrders, error: rawError } = await supabaseAdmin.from('orders').select('*')
    console.log("Raw Orders Query Result:", { error: rawError?.message, count: rawOrders?.length })
}
test()

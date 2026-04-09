import { createClient } from "@/lib/supabase/server"
import { ProductListClient } from "./components/ProductListClient"
import type { ProductTableProduct } from "./components/ProductTable"

export default async function AdminProdutos() {
    const supabase = await createClient()

    const { data: products } = await supabase
        .from('products')
        .select(`
            id,
            name,
            base_price,
            is_active,
            category:categories(name),
            images:product_images(image_url, is_primary)
        `)
        .order('created_at', { ascending: false })

    return <ProductListClient products={(products ?? []) as ProductTableProduct[]} />
}

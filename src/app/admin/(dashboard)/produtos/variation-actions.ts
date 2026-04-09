import { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/supabase/database.types"

type VariationInput = {
    color?: string | null
    size?: string | null
    sku?: string | null
    stock_quantity?: number
}

export async function updateProductVariations(
    supabase: SupabaseClient<Database>,
    productId: string,
    variations: VariationInput[],
) {
    const { error: deleteError } = await supabase
        .from("product_variations")
        .delete()
        .eq("product_id", productId)

    if (deleteError) throw deleteError

    const varsToInsert: Database["public"]["Tables"]["product_variations"]["Insert"][] = variations
        .map((variation) => ({
            color: variation.color?.trim() || null,
            size: variation.size?.trim() || null,
            sku: variation.sku?.trim() || null,
            stock_quantity: variation.stock_quantity ?? 0,
            product_id: productId,
        }))
        .filter((variation) => variation.color || variation.size)

    if (varsToInsert.length === 0) {
        throw new Error('Adicione pelo menos uma variação válida.')
    }

    const { error: insertError } = await supabase.from("product_variations").insert(varsToInsert)
    if (insertError) throw insertError
}

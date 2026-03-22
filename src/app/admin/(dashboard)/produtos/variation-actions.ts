import { SupabaseClient } from "@supabase/supabase-js"

export async function updateProductVariations(supabase: SupabaseClient, productId: string, variations: any[]) {
    // Deletar variações antigas e inserir novas (simplificado para o action)
    const { error: delError } = await supabase.from('product_variations').delete().eq('product_id', productId)
    if (delError) throw delError

    const varsToInsert = variations.map((v: any) => {
        const { id, created_at, updated_at, ...rest } = v;
        return { ...rest, product_id: productId };
    })
    
    const { error: insError } = await supabase.from('product_variations').insert(varsToInsert)
    if (insError) throw insError
}

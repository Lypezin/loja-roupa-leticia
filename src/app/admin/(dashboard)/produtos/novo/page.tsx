import { ProductForm } from "@/components/admin/ProductForm"
import { createClient } from "@/lib/supabase/server"

export default async function NovoProdutoPage() {
    const supabase = await createClient()

    const [{ data: categories }, { data: lastShippingReadyProduct }] = await Promise.all([
        supabase.from("categories").select("*").order("name"),
        supabase
            .from("products")
            .select("name, weight_kg, length_cm, width_cm, height_cm")
            .not("weight_kg", "is", null)
            .not("length_cm", "is", null)
            .not("width_cm", "is", null)
            .not("height_cm", "is", null)
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle(),
    ])

    const shippingDefaults = lastShippingReadyProduct ? {
        sourceProductName: lastShippingReadyProduct.name,
        weight_kg: Number(lastShippingReadyProduct.weight_kg),
        length_cm: Number(lastShippingReadyProduct.length_cm),
        width_cm: Number(lastShippingReadyProduct.width_cm),
        height_cm: Number(lastShippingReadyProduct.height_cm),
    } : null

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Criar produto</h1>
                <p className="text-zinc-500">
                    Cadastre as informações principais, defina o pacote usado no frete e monte a grade de estoque em um fluxo mais direto.
                </p>
            </div>

            <ProductForm categories={categories || []} shippingDefaults={shippingDefaults} />
        </div>
    )
}

import { AdminPageHeader } from "@/components/admin/layout/AdminPageHeader"
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
            <AdminPageHeader
                eyebrow="Catálogo"
                title="Novo produto."
                description="Cadastre o item por etapas: dados principais, pacote para frete, imagens, variações e publicação. O formulário já traz o último pacote salvo como referência."
                metrics={[
                    { label: "Categorias", value: String(categories?.length || 0), description: "Coleções disponíveis para associar o produto." },
                    { label: "Medidas reaproveitáveis", value: shippingDefaults ? "Sim" : "Não", description: shippingDefaults ? `Base: ${shippingDefaults.sourceProductName}.` : "Nenhum pacote salvo para copiar." },
                ]}
            />

            <ProductForm categories={categories || []} shippingDefaults={shippingDefaults} />
        </div>
    )
}

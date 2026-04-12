import { notFound } from "next/navigation"
import { AdminPageHeader } from "@/components/admin/layout/AdminPageHeader"
import { ProductForm } from "@/components/admin/ProductForm"
import { createClient } from "@/lib/supabase/server"

export default async function EditarProdutoPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const supabase = await createClient()

    const [{ data: product, error }, { data: categories }, { data: lastShippingReadyProduct }] = await Promise.all([
        supabase
            .from("products")
            .select(`
                *,
                product_variations(*),
                images:product_images(id, image_url, is_primary, display_order)
            `)
            .eq("id", id)
            .single(),
        supabase.from("categories").select("*").order("name"),
        supabase
            .from("products")
            .select("id, name, weight_kg, length_cm, width_cm, height_cm")
            .not("weight_kg", "is", null)
            .not("length_cm", "is", null)
            .not("width_cm", "is", null)
            .not("height_cm", "is", null)
            .order("created_at", { ascending: false })
            .limit(3),
    ])

    if (error || !product) {
        return notFound()
    }

    const formattedProduct = {
        ...product,
        variations: product.product_variations,
        images: [...(product.images || [])].sort((a, b) => {
            const displayOrderA = typeof a.display_order === "number" ? a.display_order : Number.MAX_SAFE_INTEGER
            const displayOrderB = typeof b.display_order === "number" ? b.display_order : Number.MAX_SAFE_INTEGER

            if (displayOrderA !== displayOrderB) {
                return displayOrderA - displayOrderB
            }

            return Number(Boolean(b.is_primary)) - Number(Boolean(a.is_primary))
        }),
    }

    const shippingDefaultsCandidate = (lastShippingReadyProduct || []).find((item) => item.id !== product.id) ?? null
    const shippingDefaults = shippingDefaultsCandidate ? {
        sourceProductName: shippingDefaultsCandidate.name,
        weight_kg: Number(shippingDefaultsCandidate.weight_kg),
        length_cm: Number(shippingDefaultsCandidate.length_cm),
        width_cm: Number(shippingDefaultsCandidate.width_cm),
        height_cm: Number(shippingDefaultsCandidate.height_cm),
    } : null

    return (
        <div className="flex flex-col gap-6">
            <AdminPageHeader
                eyebrow="Catálogo"
                title={`Editar ${product.name}.`}
                description="Revise informações principais, galeria, variações, visibilidade e medidas de frete sem perder o contexto do item atual."
                metrics={[
                    { label: "Categoria", value: categories?.find((category) => category.id === product.category_id)?.name || "Sem categoria", description: "Coleção atual do produto." },
                    { label: "Imagens", value: String(product.images?.length || 0), description: "Fotos já vinculadas ao item." },
                    { label: "Variações", value: String(product.product_variations?.length || 0), description: "Linhas de venda cadastradas." },
                ]}
            />

            <ProductForm
                categories={categories || []}
                product={formattedProduct}
                shippingDefaults={shippingDefaults}
            />
        </div>
    )
}

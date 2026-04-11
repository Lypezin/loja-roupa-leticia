import { notFound } from "next/navigation"
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
                images:product_images(id, image_url, is_primary)
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
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Editar produto</h1>
                <p className="text-zinc-500">
                    Atualize conteúdo, pacote de envio, imagens e grade de estoque sem sair do painel.
                </p>
            </div>

            <ProductForm
                categories={categories || []}
                product={formattedProduct}
                shippingDefaults={shippingDefaults}
            />
        </div>
    )
}

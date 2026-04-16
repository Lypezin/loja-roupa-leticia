'use server'

import { revalidatePath } from "next/cache"
import { getProductPath } from "@/lib/products"
import { requireAdmin } from "@/lib/supabase/server"
import { manageProductImages } from "../image-actions"
import { updateProductVariations } from "../variation-actions"
import { getErrorMessage, parsePositiveDecimal } from "./utils"

type CategorySlugRelation = { slug?: string | null } | Array<{ slug?: string | null }> | null

function getCategorySlug(category: CategorySlugRelation) {
    return Array.isArray(category) ? (category[0]?.slug ?? null) : (category?.slug ?? null)
}

export async function saveProduct(formData: FormData) {
    try {
        const supabase = await requireAdmin()
        const productId = formData.get("product_id") as string | null
        const name = formData.get("name") as string
        const description = formData.get("description") as string
        const basePrice = Number.parseFloat(String(formData.get("base_price") || "").replace(",", "."))
        const categoryId = formData.get("category_id") as string
        const weightKg = parsePositiveDecimal(formData.get("weight_kg"), "Peso")
        const lengthCm = parsePositiveDecimal(formData.get("length_cm"), "Comprimento")
        const widthCm = parsePositiveDecimal(formData.get("width_cm"), "Largura")
        const heightCm = parsePositiveDecimal(formData.get("height_cm"), "Altura")
        const isActive = formData.get("is_active") === "true"
        const variations = JSON.parse(formData.get("variations_json") as string)

        if (!name?.trim()) throw new Error("Nome do produto e obrigatorio.")
        if (!categoryId) throw new Error("Selecione uma categoria para o produto.")
        if (!Number.isFinite(basePrice) || basePrice < 0) throw new Error("Preco do produto invalido.")

        let finalId = productId
        let previousCategorySlug: string | null = null

        if (productId) {
            const { data: currentProduct } = await supabase
                .from("products")
                .select("category:categories(slug)")
                .eq("id", productId)
                .maybeSingle()

            previousCategorySlug = getCategorySlug((currentProduct?.category as CategorySlugRelation | undefined) ?? null)

            const { error } = await supabase
                .from("products")
                .update({
                    name,
                    description,
                    base_price: basePrice,
                    category_id: categoryId,
                    weight_kg: weightKg,
                    length_cm: lengthCm,
                    width_cm: widthCm,
                    height_cm: heightCm,
                    is_active: isActive,
                })
                .eq("id", productId)

            if (error) throw error
        } else {
            const { data, error } = await supabase
                .from("products")
                .insert([{
                    name,
                    description,
                    base_price: basePrice,
                    category_id: categoryId,
                    weight_kg: weightKg,
                    length_cm: lengthCm,
                    width_cm: widthCm,
                    height_cm: heightCm,
                    is_active: isActive,
                }])
                .select("id")
                .single()

            if (error || !data) throw new Error(error?.message || "Erro ao criar produto no banco.")
            finalId = data.id
        }

        await updateProductVariations(supabase, finalId!, variations)
        await manageProductImages(
            supabase,
            finalId!,
            formData.get("existing_images_json") as string,
            formData.get("uploaded_image_urls") as string,
        )

        const { data: savedProduct } = await supabase
            .from("products")
            .select("slug, category:categories(slug)")
            .eq("id", finalId!)
            .maybeSingle()

        const currentCategorySlug = getCategorySlug((savedProduct?.category as CategorySlugRelation | undefined) ?? null)

        revalidatePath("/admin/produtos")
        revalidatePath("/")
        revalidatePath("/produtos")
        revalidatePath("/sitemap.xml")

        if (previousCategorySlug) {
            revalidatePath(`/${previousCategorySlug}`)
        }

        if (currentCategorySlug) {
            revalidatePath(`/${currentCategorySlug}`)
        }

        if (savedProduct?.slug) {
            revalidatePath(getProductPath(savedProduct.slug))
        }

        return { success: true }
    } catch (error: unknown) {
        return { error: getErrorMessage(error, "Erro ao salvar produto.") }
    }
}

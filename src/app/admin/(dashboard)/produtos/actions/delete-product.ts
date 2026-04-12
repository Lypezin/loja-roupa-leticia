'use server'

import { revalidatePath } from "next/cache"
import { requireAdmin } from "@/lib/supabase/server"
import { getErrorMessage } from "./utils"

export async function deleteProduct(productId: string) {
    try {
        const supabase = await requireAdmin()

        const { data: productImages, error: productImagesError } = await supabase
            .from("product_images")
            .select("image_url")
            .eq("product_id", productId)

        if (productImagesError) throw productImagesError

        const storagePaths = (productImages ?? [])
            .map((image) => {
                const parts = image.image_url.split("/product-images/")
                return parts.length > 1 ? parts[1] : null
            })
            .filter((path): path is string => Boolean(path))

        if (storagePaths.length > 0) {
            const { error: storageError } = await supabase.storage
                .from("product-images")
                .remove(storagePaths)
            if (storageError) throw storageError
        }

        const { error: imagesDeleteError } = await supabase.from("product_images").delete().eq("product_id", productId)
        if (imagesDeleteError) throw imagesDeleteError

        const { error: variationsDeleteError } = await supabase.from("product_variations").delete().eq("product_id", productId)
        if (variationsDeleteError) throw variationsDeleteError

        const { error } = await supabase.from("products").delete().eq("id", productId)
        if (error) throw error

        revalidatePath("/admin/produtos")
        revalidatePath("/")
        return { success: true }
    } catch (error: unknown) {
        return { error: getErrorMessage(error, "Erro ao excluir produto.") }
    }
}

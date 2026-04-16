'use server'

import { revalidatePath } from "next/cache"
import { requireAdmin } from "@/lib/supabase/server"
import { validateImageFile } from "@/lib/uploads"

function getErrorMessage(error: unknown) {
    return error instanceof Error ? error.message : 'Erro ao atualizar categoria.'
}

export async function updateCategory(id: string, formData: FormData) {
    try {
        const supabase = await requireAdmin()
        const name = ((formData.get("name") as string) || "").trim()
        const image = formData.get('image') as File | null

        if (!name) {
            return { error: "Informe um nome para a categoria." }
        }

        if (name.length > 80) {
            return { error: "O nome da categoria deve ter no maximo 80 caracteres." }
        }

        const slug = name
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/\s+/g, '-')

        const updateData: Record<string, string> = { name, slug }

        if (image && image.size > 0) {
            const validatedImage = await validateImageFile(image)

            const { data: oldCategory } = await supabase
                .from('categories')
                .select('image_url')
                .eq('id', id)
                .single()

            const fileExt = validatedImage?.extension || "jpg"
            const fileName = `${crypto.randomUUID()}.${fileExt}`
            const filePath = `categories/${slug}/${fileName}`

            const { error: uploadError } = await supabase.storage
                .from('product-images')
                .upload(filePath, image, {
                    cacheControl: "31536000",
                    contentType: image.type,
                    upsert: false,
                })

            if (uploadError) {
                return { error: `Falha ao subir a nova imagem: ${uploadError.message}` }
            }

            const { data: { publicUrl } } = supabase.storage
                .from('product-images')
                .getPublicUrl(filePath)

            updateData.image_url = publicUrl

            if (oldCategory?.image_url) {
                try {
                    const urlObj = new URL(oldCategory.image_url)
                    const pathParts = urlObj.pathname.split('/product-images/')
                    if (pathParts.length > 1) {
                        const oldFilePath = pathParts[1]
                        await supabase.storage
                            .from('product-images')
                            .remove([oldFilePath])
                    }
                } catch (storageError) {
                    console.error('Falha ao deletar imagem antiga do storage:', storageError)
                }
            }
        }

        const { error } = await supabase
            .from('categories')
            .update(updateData)
            .eq('id', id)

        if (error) {
            if (error.code === '23505') {
                return { error: 'Uma categoria com este nome já existe.' }
            }

            return { error: error.message }
        }

        revalidatePath('/admin/categorias')
        revalidatePath('/admin/produtos/novo')
        revalidatePath('/')
        return { success: true }
    } catch (error: unknown) {
        return { error: getErrorMessage(error) }
    }
}

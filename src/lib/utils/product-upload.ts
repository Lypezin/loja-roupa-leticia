'use client'

import { createClient } from "@/lib/supabase/client"
import { validateImageFile } from "@/lib/uploads"

export async function uploadProductImages(files: FileList | null, productId: string) {
    if (!files || files.length === 0) return []

    const supabase = createClient()
    const uploadedUrls: string[] = []

    for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const validatedImage = await validateImageFile(file)
        const fileExt = validatedImage?.extension || "jpg"
        const fileName = `products/${productId || "new"}/${crypto.randomUUID()}-${i}.${fileExt}`

        const { error: uploadError } = await supabase.storage
            .from('product-images')
            .upload(fileName, file, {
                cacheControl: "31536000",
                contentType: file.type,
                upsert: false,
            })

        if (uploadError) {
            throw new Error(`Falha ao enviar "${file.name}": ${uploadError.message}`)
        }

        const { data: { publicUrl } } = supabase.storage
            .from('product-images')
            .getPublicUrl(fileName)

        uploadedUrls.push(publicUrl)
    }

    return uploadedUrls
}

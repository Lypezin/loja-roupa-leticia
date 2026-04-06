'use client'

import { createClient } from "@/lib/supabase/client"
import { validateImageFile } from "@/lib/uploads"

export async function uploadProductImages(files: FileList | null, productId: string) {
    if (!files || files.length === 0) return []

    const supabase = createClient()
    const uploadedUrls: string[] = []

    for (let i = 0; i < files.length; i++) {
        const file = files[i]
        validateImageFile(file)
        const fileExt = file.name.split('.').pop()
        const fileName = `${productId || 'new'}-${Date.now()}-${i}.${fileExt}`

        const { error: uploadError } = await supabase.storage
            .from('product-images')
            .upload(fileName, file)

        if (uploadError) {
            console.error("Erro no upload:", uploadError)
            continue
        }

        const { data: { publicUrl } } = supabase.storage
            .from('product-images')
            .getPublicUrl(fileName)

        uploadedUrls.push(publicUrl)
    }

    return uploadedUrls
}

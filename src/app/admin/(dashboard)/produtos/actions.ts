'use server'

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function saveProduct(formData: FormData) {
    try {
        const supabase = await createClient()

        const productId = formData.get('product_id') as string | null
        const name = formData.get('name') as string
        const description = formData.get('description') as string
        const base_price = parseFloat(formData.get('base_price') as string)
        const category_id = formData.get('category_id') as string
        const is_active = formData.get('is_active') === 'true'

        const variationsJson = formData.get('variations_json') as string
        const variations = JSON.parse(variationsJson)

        let newProductId = productId

        if (productId) {
            const { error } = await supabase
                .from('products')
                .update({ name, description, base_price, category_id, is_active })
                .eq('id', productId)

            if (error) return { error: error.message }

            await supabase.from('product_variations').delete().eq('product_id', productId)
            const varsToInsert = variations.map((v: any) => ({ ...v, product_id: productId }))
            await supabase.from('product_variations').insert(varsToInsert)

        } else {
            const { data: productData, error } = await supabase
                .from('products')
                .insert([{ name, description, base_price, category_id, is_active }])
                .select('id')
                .single()

            if (error) return { error: error.message }
            newProductId = productData.id

            const varsToInsert = variations.map((v: any) => ({ ...v, product_id: newProductId }))
            const { error: varError } = await supabase
                .from('product_variations')
                .insert(varsToInsert)

            if (varError) return { error: varError.message }
        }

        const imageFiles = formData.getAll('images') as File[]
        const validImages = imageFiles.filter(file => file.size > 0)

        if (validImages.length > 0) {
            for (let i = 0; i < validImages.length; i++) {
                const file = validImages[i]
                const fileExt = file.name.split('.').pop()
                const fileName = `${newProductId}-${Date.now()}-${i}.${fileExt}`
                const filePath = `${fileName}`

                const { error: uploadError } = await supabase.storage
                    .from('product-images')
                    .upload(filePath, file)

                if (uploadError) {
                    console.error("Erro no upload da imagem:", uploadError)
                    continue
                }

                const { data: { publicUrl } } = supabase.storage
                    .from('product-images')
                    .getPublicUrl(filePath)

                await supabase.from('product_images').insert({
                    product_id: newProductId,
                    image_url: publicUrl,
                    is_primary: i === 0 && !productId,
                    display_order: i
                })
            }
        }

        revalidatePath('/admin/produtos')
        revalidatePath('/')
        return { success: true }
    } catch (err: any) {
        return { error: err.message || 'Erro Interno no Servidor.' }
    }
}

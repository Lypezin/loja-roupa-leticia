'use server'

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function saveProduct(formData: FormData) {
    const supabase = await createClient()

    const productId = formData.get('product_id') as string | null
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const base_price = parseFloat(formData.get('base_price') as string)
    const category_id = formData.get('category_id') as string
    const is_active = formData.get('is_active') === 'true' // checkbox

    const variationsJson = formData.get('variations_json') as string
    const variations = JSON.parse(variationsJson)

    // 1. Salvar na Tabela Products
    let newProductId = productId

    if (productId) {
        // Editar Produto Existente
        const { error } = await supabase
            .from('products')
            .update({ name, description, base_price, category_id, is_active })
            .eq('id', productId)

        if (error) throw new Error(error.message)

        // Por simplicidade na V1 de um projeto pequeno, ao editar as variações, vamos dropar as antigas e re-inserir.
        // Como a FK order_items aponta pra variação atual, uma aproximação melhor no futuro será dar UPDATE individual ou 'is_active' em variations. Mas com onDelete RESTRICT o DB vai nos proteger se a variação já foi vendida.
        // Vamos apenas rodar UPDATE / INSERT inteligente pras variações.

        // Simplificacao pra este rascunho:
        await supabase.from('product_variations').delete().eq('product_id', productId)
        const varsToInsert = variations.map((v: any) => ({ ...v, product_id: productId }))
        await supabase.from('product_variations').insert(varsToInsert)

    } else {
        // Criar Novo Produto
        const { data: productData, error } = await supabase
            .from('products')
            .insert([{ name, description, base_price, category_id, is_active }])
            .select('id')
            .single()

        if (error) throw new Error(error.message)
        newProductId = productData.id

        // Inserir Variações Vinculadas
        const varsToInsert = variations.map((v: any) => ({ ...v, product_id: newProductId }))
        const { error: varError } = await supabase
            .from('product_variations')
            .insert(varsToInsert)

        if (varError) throw new Error(varError.message)
    }

    // 3. Processar Imagens Inseridas
    const imageFiles = formData.getAll('images') as File[]
    const validImages = imageFiles.filter(file => file.size > 0)

    if (validImages.length > 0) {
        for (let i = 0; i < validImages.length; i++) {
            const file = validImages[i]
            const fileExt = file.name.split('.').pop()
            const fileName = `${newProductId}-${Date.now()}-${i}.${fileExt}`
            const filePath = `${fileName}`

            // Faz o upload fisico do Blob para o Bucket do Supabase
            const { error: uploadError } = await supabase.storage
                .from('product-images')
                .upload(filePath, file)

            if (uploadError) {
                console.error("Erro no upload da imagem:", uploadError)
                continue
            }

            // Pega a URL Publica
            const { data: { publicUrl } } = supabase.storage
                .from('product-images')
                .getPublicUrl(filePath)

            // Salva na tabela Product_Images referenciando o produto
            await supabase.from('product_images').insert({
                product_id: newProductId,
                image_url: publicUrl,
                is_primary: i === 0 && !productId, // Só marca como primária a foto 0 e SE for produto novo
                display_order: i
            })
        }
    }

    // Se conseguimos chegar até aqui, revalida a listagem global ou do produto e redireciona.
    revalidatePath('/admin/produtos')
    revalidatePath('/')
}

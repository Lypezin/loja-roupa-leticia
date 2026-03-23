'use server'

import { requireAdmin } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { manageProductImages } from "./image-actions"
import { updateProductVariations } from "./variation-actions"
import { stripe } from "@/lib/stripe"

export async function saveProduct(formData: FormData) {
    try {
        const supabase = await requireAdmin()
        const productId = formData.get('product_id') as string | null
        const name = formData.get('name') as string
        const description = formData.get('description') as string
        const base_price = parseFloat(formData.get('base_price') as string)
        const category_id = formData.get('category_id') as string
        const is_active = formData.get('is_active') === 'true'
        const variations = JSON.parse(formData.get('variations_json') as string)

        let finalId = productId

        if (productId) {
            // Atualizar produto existente (Buscamos o ID da Stripe primeiro)
            const { data: existingProduct } = await supabase.from('products').select('stripe_product_id').eq('id', productId).single()
            
            // Sincroniza atualização de titulo/descrição para a Stripe se existir
            if (existingProduct?.stripe_product_id) {
                try {
                    await stripe.products.update(existingProduct.stripe_product_id, {
                        name,
                        description,
                        active: is_active
                    })
                } catch (stripeErr) {
                    console.error('Aviso: Falha ao atualizar na Stripe:', stripeErr)
                }
            }
            
            await supabase.from('products').update({ name, description, base_price, category_id, is_active }).eq('id', productId)
        } else {
            // CRIAR NOVO PRODUTO NA STRIPE E NO SUPABASE SIMULTANEAMENTE
            let stripeProductId = null
            let stripePriceId = null

            try {
                if (process.env.STRIPE_SECRET_KEY) {
                    // 1. Cria o Produto na Stripe
                    const stripeProduct = await stripe.products.create({
                        name,
                        description,
                        active: is_active
                    })
                    
                    // 2. Cria o Preço cobrado no Brasil
                    const stripePrice = await stripe.prices.create({
                        product: stripeProduct.id,
                        unit_amount: Math.round(base_price * 100), // R$ 10,00 -> 1000 centavos
                        currency: 'brl',
                    })
                    
                    stripeProductId = stripeProduct.id
                    stripePriceId = stripePrice.id
                }
            } catch (stripeErr) {
                console.error("Erro na integração com a Stripe: ", stripeErr)
                // Se a Stripe falhar, nós avisamos, mas podemos decidir se o backend deve interromper ou criar mesmo assim (vamos deixar tentar criar sem Stripe)
            }

            // Inserir no Supabase salvando as chaves conectadas
            const insertData: any = { name, description, base_price, category_id, is_active }
            if (stripeProductId && stripePriceId) {
                insertData.stripe_product_id = stripeProductId
                insertData.stripe_price_id = stripePriceId
            }

            const { data, error } = await supabase.from('products').insert([insertData]).select('id').single()
            if (error || !data) throw new Error(error?.message || 'Erro ao criar produto no banco.')
            finalId = data.id
        }

        await updateProductVariations(supabase, finalId!, variations)
        await manageProductImages(supabase, finalId!, formData.get('existing_images_json') as string, formData.get('uploaded_image_urls') as string)

        revalidatePath('/admin/produtos'); revalidatePath('/')
        return { success: true }
    } catch (error: any) {
        return { error: error.message || 'Erro ao salvar produto.' }
    }
}

export async function deleteProduct(productId: string) {
    try {
        const supabase = await requireAdmin()
        
        // Simplified: delete relations then product
        await supabase.from('product_images').delete().eq('product_id', productId)
        await supabase.from('product_variations').delete().eq('product_id', productId)
        const { error } = await supabase.from('products').delete().eq('id', productId)
        
        if (error) throw error
        revalidatePath('/admin/produtos'); revalidatePath('/')
        return { success: true }
    } catch (error: any) {
        return { error: error.message || 'Erro ao excluir produto.' }
    }
}

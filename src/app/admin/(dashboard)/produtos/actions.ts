'use server'

import { getStripeClient } from "@/lib/stripe-client"
import { requireAdmin } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { manageProductImages } from "./image-actions"
import { updateProductVariations } from "./variation-actions"

function getErrorMessage(error: unknown, fallback: string) {
    if (error instanceof Error && error.message) {
        return error.message
    }

    return fallback
}

export async function saveProduct(formData: FormData) {
    try {
        const supabase = await requireAdmin()
        const stripe = getStripeClient()
        const productId = formData.get('product_id') as string | null
        const name = formData.get('name') as string
        const description = formData.get('description') as string
        const base_price = parseFloat(formData.get('base_price') as string)
        const category_id = formData.get('category_id') as string
        const is_active = formData.get('is_active') === 'true'
        const variations = JSON.parse(formData.get('variations_json') as string)

        if (!name?.trim()) {
            throw new Error('Nome do produto e obrigatorio.')
        }

        if (!Number.isFinite(base_price) || base_price < 0) {
            throw new Error('Preco do produto invalido.')
        }

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
            } catch (stripeErr: unknown) {
                console.error("Erro na integração com a Stripe:", stripeErr)
                throw new Error("Erro na Stripe: " + getErrorMessage(stripeErr, 'Falha ao criar produto na Stripe.'))
            }

            // Inserir no Supabase salvando as chaves conectadas
            const insertData: {
                name: string
                description: string
                base_price: number
                category_id: string
                is_active: boolean
                stripe_product_id?: string
                stripe_price_id?: string
            } = { name, description, base_price, category_id, is_active }
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
    } catch (error: unknown) {
        return { error: getErrorMessage(error, 'Erro ao salvar produto.') }
    }
}

export async function deleteProduct(productId: string) {
    try {
        const supabase = await requireAdmin()
        const stripe = getStripeClient()
        
        // 1. Busca se esse produto tem ID conectada com a Stripe
        const { data: productToDelete } = await supabase.from('products').select('stripe_product_id').eq('id', productId).single()
        
        if (productToDelete?.stripe_product_id) {
            try {
                // Tentamos arquivar na Stripe (se já tiver venda a Stripe não deixa excluir 100%, então inativar é a prática universal)
                await stripe.products.update(productToDelete.stripe_product_id, { active: false })
            } catch (stripeErr: unknown) {
                console.error("Aviso: Falha ao arquivar produto na Stripe:", stripeErr)
            }
        }

        // 2. Continua apagando todas as referencias do banco normalmente
        await supabase.from('product_images').delete().eq('product_id', productId)
        await supabase.from('product_variations').delete().eq('product_id', productId)
        const { error } = await supabase.from('products').delete().eq('id', productId)
        
        if (error) throw error
        revalidatePath('/admin/produtos'); revalidatePath('/')
        return { success: true }
    } catch (error: unknown) {
        return { error: getErrorMessage(error, 'Erro ao excluir produto.') }
    }
}

import type Stripe from "stripe"
import { createClient } from "@/lib/supabase/server"
import { ProductRecord, VariationRecord, ValidatedCheckoutItem } from "@/types/checkout"

type CheckoutCartItem = {
  product_id: string
  variation_id: string
  quantity: number
}

export async function validateCheckoutItems(productIds: string[], variationIds: string[]) {
  const supabase = await createClient()

  const [{ data: ps, error: pe }, { data: vs, error: ve }] = await Promise.all([
    supabase.from('products').select('id, name, base_price, is_active').in('id', productIds).eq('is_active', true),
    supabase.from('product_variations').select('id, product_id, size, color, stock_quantity').in('id', variationIds),
  ])

  if (pe || !ps || ps.length !== productIds.length) throw new Error('Falha ao validar produtos selecionados.')
  if (ve || !vs || vs.length !== variationIds.length) throw new Error('Falha ao validar variacoes do carrinho.')

  const products = ps as ProductRecord[]
  const variations = vs as VariationRecord[]

  return {
    productsById: new Map<string, ProductRecord>(products.map((product) => [product.id, product])),
    variationsById: new Map<string, VariationRecord>(variations.map((variation) => [variation.id, variation]))
  }
}

export function getValidatedItems(
  normalizedCartItems: CheckoutCartItem[],
  productsById: Map<string, ProductRecord>,
  variationsById: Map<string, VariationRecord>
): ValidatedCheckoutItem[] {
  return normalizedCartItems.map((cartItem) => {
    const productInfo = productsById.get(cartItem.product_id)
    const variationInfo = variationsById.get(cartItem.variation_id)

    if (!productInfo || !productInfo.is_active) {
      throw new Error('Produto indisponivel para checkout.')
    }

    if (!variationInfo || variationInfo.product_id !== productInfo.id) {
      throw new Error(`Variacao invalida para o produto ${productInfo.name}.`)
    }

    if (variationInfo.stock_quantity < cartItem.quantity) {
      throw new Error(`Estoque insuficiente para ${productInfo.name}.`)
    }

    return {
      product_id: productInfo.id,
      product_name: productInfo.name,
      variation_id: variationInfo.id,
      size: variationInfo.size,
      color: variationInfo.color,
      unit_price: productInfo.base_price,
      quantity: cartItem.quantity,
    }
  })
}

export function buildStripeLineItems(
  validatedItems: ValidatedCheckoutItem[]
): Stripe.Checkout.SessionCreateParams.LineItem[] {
  return validatedItems.map((item) => ({
    price_data: {
      currency: 'brl',
      unit_amount: Math.round(item.unit_price * 100),
      product_data: {
        name: `${item.product_name}${item.size ? ` (${item.size})` : ''}`,
        description: item.color ? `Cor: ${item.color}` : undefined,
        metadata: {
          product_id: item.product_id,
          variation_id: item.variation_id,
        },
      },
    },
    quantity: item.quantity,
  }))
}

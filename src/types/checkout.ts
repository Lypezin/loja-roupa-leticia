export type ProductRecord = {
  id: string
  name: string
  base_price: number
  is_active: boolean
}

export type VariationRecord = {
  id: string
  product_id: string
  size: string | null
  color: string | null
  stock_quantity: number
}

export type ValidatedCheckoutItem = {
  product_id: string
  product_name: string
  variation_id: string
  size: string | null
  color: string | null
  unit_price: number
  quantity: number
}

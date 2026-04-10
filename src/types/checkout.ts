export type ProductRecord = {
  id: string
  name: string
  base_price: number
  is_active: boolean
  weight_kg: number | null
  height_cm: number | null
  width_cm: number | null
  length_cm: number | null
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
  weight_kg: number
  height_cm: number
  width_cm: number
  length_cm: number
}

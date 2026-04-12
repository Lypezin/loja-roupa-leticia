export type Category = { id: string; name: string }

export type Variation = { 
    size: string; 
    color: string; 
    stock_quantity: number 
}

export type ExistingImage = { 
    id?: string; 
    image_url: string; 
    is_primary: boolean; 
    display_order?: number | null 
}

export type ProductData = {
    id: string
    name: string
    description?: string
    base_price: number
    weight_kg?: number | null
    height_cm?: number | null
    width_cm?: number | null
    length_cm?: number | null
    category_id: string
    is_active: boolean
    variations?: Variation[]
    images?: ExistingImage[]
}

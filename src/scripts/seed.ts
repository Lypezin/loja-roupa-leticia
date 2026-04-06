import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase variables')
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

type CategoryRow = {
    id: string
    slug: string
}

async function seed() {
    console.log('Starting seed...')

    const { data: catData, error: catError } = await supabase
        .from('categories')
        .insert([
            { name: 'Camisetas', slug: 'camisetas' },
            { name: 'Calcas', slug: 'calcas' }
        ])
        .select('id, slug')

    if (catError || !catData) {
        console.error('Erro ao inserir categorias:', catError)
        return
    }

    const camisetasId = (catData as CategoryRow[]).find((category) => category.slug === 'camisetas')?.id
    const calcasId = (catData as CategoryRow[]).find((category) => category.slug === 'calcas')?.id

    const { data: prodData, error: prodError } = await supabase
        .from('products')
        .insert([
            {
                name: 'Camiseta Oversized Preta',
                description: 'Camiseta 100% algodao premium, caimento perfeito.',
                base_price: 129.9,
                category_id: camisetasId,
            },
            {
                name: 'Calca Cargo Bege',
                description: 'Calca cargo com 6 bolsos e tecido resistente.',
                base_price: 189.9,
                category_id: calcasId,
            }
        ])
        .select('id')

    if (prodError || !prodData || prodData.length < 2) {
        console.error('Erro ao inserir produtos:', prodError)
        return
    }

    const camisetaId = prodData[0].id
    const calcaId = prodData[1].id

    const { error: varError } = await supabase
        .from('product_variations')
        .insert([
            { product_id: camisetaId, size: 'P', color: 'Preto', stock_quantity: 5 },
            { product_id: camisetaId, size: 'M', color: 'Preto', stock_quantity: 10 },
            { product_id: calcaId, size: 'M', color: 'Bege', stock_quantity: 8 },
            { product_id: calcaId, size: 'G', color: 'Bege', stock_quantity: 2 },
        ])

    if (varError) {
        console.error('Erro ao inserir variacoes:', varError)
        return
    }

    console.log('Seed finalizado com sucesso.')
}

seed()

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY // Usando ANON KEY apenas pra ambiente DEV local em RLS Public, depois trocamos se necessário, ou inserimos com Service Role.

if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase variables')
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function seed() {
    console.log('🌱 Starting seed...')

    // 1. Inserir Categorias
    const { data: catData, error: catError } = await supabase
        .from('categories')
        .insert([
            { name: 'Camisetas', slug: 'camisetas' },
            { name: 'Calças', slug: 'calcas' }
        ])
        .select()

    if (catError) {
        console.error('Erro ao inserir categorias:', catError)
        return
    }

    const camisetasId = catData.find((c: any) => c.slug === 'camisetas')?.id
    const calcasId = catData.find((c: any) => c.slug === 'calcas')?.id

    // 2. Inserir Produtos
    const { data: prodData, error: prodError } = await supabase
        .from('products')
        .insert([
            {
                name: 'Camiseta Oversized Preta',
                description: 'Camiseta 100% algodão premium, caimento perfeito.',
                base_price: 129.90,
                category_id: camisetasId,
            },
            {
                name: 'Calça Cargo Bege',
                description: 'Calça cargo com 6 bolsos e tecido resistente.',
                base_price: 189.90,
                category_id: calcasId,
            }
        ])
        .select()

    if (prodError) {
        console.error('Erro ao inserir produtos:', prodError)
        return
    }

    const camisetaId = prodData[0].id
    const calcaId = prodData[1].id

    // 3. Inserir Variações (Tamanhos/Estoque)
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

    console.log('✅ Seed finalizado com sucesso! Produtos e estoque fakes adicionados.')
}

seed()

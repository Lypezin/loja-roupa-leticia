import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
    const supabase = await createClient()

    // Check if columns exist already by trying to select them
    const { data, error } = await supabase
        .from('store_settings')
        .select('*')
        .limit(1)
        .single()

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Check what columns exist
    const existingColumns = Object.keys(data || {})
    const newColumns = [
        'hero_badge_text',
        'hero_secondary_button_text',
        'products_section_label',
        'products_section_title',
        'categories_section_label',
        'categories_section_title'
    ]

    const missingColumns = newColumns.filter(col => !existingColumns.includes(col))

    return NextResponse.json({
        existingColumns,
        missingColumns,
        message: missingColumns.length > 0
            ? `Missing columns: ${missingColumns.join(', ')}. Please add them via Supabase Dashboard SQL Editor.`
            : 'All columns exist!'
    })
}

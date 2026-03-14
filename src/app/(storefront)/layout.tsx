import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { createClient } from "@/lib/supabase/server"

export default async function StorefrontLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()
    
    // Fetch categories and settings in parallel
    const [
        { data: categories },
        { data: settings }
    ] = await Promise.all([
        supabase.from('categories').select('id, name, slug').order('created_at', { ascending: true }),
        supabase.from('store_settings').select('store_name').single()
    ])

    return (
        <div className="flex min-h-screen flex-col bg-background text-foreground font-sans">
            <Header categories={categories || []} storeName={settings?.store_name} />
            <main className="flex-1">
                {children}
            </main>
            <Footer />
        </div>
    )
}

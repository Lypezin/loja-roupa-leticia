import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { createClient } from "@/lib/supabase/server"

export default async function StorefrontLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()
    const { data: categories } = await supabase.from('categories').select('id, name, slug').order('created_at', { ascending: true })

    return (
        <div className="flex min-h-screen flex-col bg-white text-zinc-950 font-sans">
            <Header categories={categories || []} />
            <main className="flex-1">
                {children}
            </main>
            <Footer />
        </div>
    )
}

import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { getStoreCategories, getStoreSettings } from "@/lib/storefront"
import { createClient } from "@/lib/supabase/server"

export default async function StorefrontLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()

    const [
        categories,
        settings,
        { data: { user } }
    ] = await Promise.all([
        getStoreCategories(),
        getStoreSettings(),
        supabase.auth.getUser(),
    ])

    return (
        <div className="flex min-h-screen flex-col bg-background text-foreground font-sans">
            <Header categories={categories} storeName={settings?.store_name} isLoggedIn={Boolean(user)} />
            <main className="flex-1">
                {children}
            </main>
            <Footer categories={categories} settings={settings} />
        </div>
    )
}

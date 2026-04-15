import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { getStoreCategories, getStoreSettings } from "@/lib/storefront"

export const revalidate = 60

export default async function StorefrontLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [categories, settings] = await Promise.all([
        getStoreCategories(),
        getStoreSettings(),
    ])

    return (
        <div className="flex min-h-screen flex-col bg-background text-foreground font-sans">
            <Header categories={categories} storeName={settings?.store_name} />
            <main className="animate-page-enter flex-1">
                {children}
            </main>
            <Footer categories={categories} settings={settings} />
        </div>
    )
}

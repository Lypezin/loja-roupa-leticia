import type { Metadata, Viewport } from "next"
import NextTopLoader from "nextjs-toploader"
import { ThemeProvider } from "@/components/providers/ThemeProvider"
import { Toaster } from "@/components/ui/sonner"
import { getRequestSiteUrl } from "@/lib/site-url"
import { getStoreSettings } from "@/lib/storefront"
import "./globals.css"

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getStoreSettings()
  const siteUrl = await getRequestSiteUrl()

  const title = settings?.store_name || "Loja"
  const description = settings?.store_description || "Loja online de roupas com novidades, reposições e atendimento direto."

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: `${title} | Oficial`,
      template: `%s | ${title}`
    },
    description,
    keywords: ["moda", "roupas", "loja online", "vestuário", "comprar roupa"],
    authors: [{ name: title }],
    creator: title,
    openGraph: {
      type: "website",
      locale: "pt_BR",
      url: siteUrl,
      siteName: title,
      title: `${title} | Loja Online`,
      description,
      images: [{ url: "/og-image.jpg", width: 1200, height: 630 }]
    },
    robots: {
      index: true,
      follow: true
    }
  }
}

export const viewport: Viewport = {
  themeColor: "#f5f0e8",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider>
          <NextTopLoader color="var(--primary)" showSpinner={false} />
          <Toaster position="top-right" richColors />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}

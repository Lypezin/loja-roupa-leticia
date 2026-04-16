import { MetadataRoute } from "next"
import { getProductPath } from "@/lib/products"
import { getSiteUrl } from "@/lib/site-url"
import { createPublicClient } from "@/lib/supabase/public"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const supabase = createPublicClient()
    const baseUrl = getSiteUrl()

    const [{ data: categories }, { data: products }] = await Promise.all([
        supabase.from("categories").select("slug, created_at"),
        supabase
            .from("products")
            .select("slug, created_at")
            .eq("is_active", true),
    ])

    const categoryEntries = (categories || []).map((category) => ({
        url: `${baseUrl}/${category.slug}`,
        lastModified: category.created_at ? new Date(category.created_at) : new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.8,
    }))

    const productEntries = (products || []).map((product) => ({
        url: `${baseUrl}${getProductPath(product.slug)}`,
        lastModified: product.created_at ? new Date(product.created_at) : new Date(),
        changeFrequency: "daily" as const,
        priority: 1,
    }))

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: "daily" as const,
            priority: 1,
        },
        ...categoryEntries,
        ...productEntries,
    ]
}

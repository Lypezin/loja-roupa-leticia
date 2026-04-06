import { Heart, Sparkles, Users } from "lucide-react"
import { getStoreSettings } from "@/lib/storefront"

export const revalidate = 60

export default async function SobrePage() {
    const settings = await getStoreSettings()
    const storeName = settings?.store_name || 'Fashion Store'

    return (
        <div className="page-shell py-8 md:py-12">
            <section className="paper-panel rounded-[2.4rem] px-6 py-10 md:px-10 md:py-14">
                <div className="mx-auto max-w-3xl text-center">
                    <span className="eyebrow justify-center">sobre a marca</span>
                    <h1 className="mt-5 font-display text-4xl text-foreground md:text-6xl">Uma loja feita para o uso real</h1>
                    <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-muted-foreground">
                        A {storeName} foi pensada para reunir roupas faceis de combinar, boas fotos do produto e uma compra sem rodeios.
                    </p>
                </div>
            </section>

            <section className="py-12 md:py-16">
                <div className="grid gap-5 md:grid-cols-3">
                    {[
                        { icon: Sparkles, title: "Boa escolha de produto", desc: "Modelos selecionados com foco em caimento, tecido e uso no dia a dia." },
                        { icon: Heart, title: "Loja organizada", desc: "Categorias, fotos e informacoes pensadas para facilitar a decisao de compra." },
                        { icon: Users, title: "Atendimento proximo", desc: "Contato claro, linguagem simples e suporte quando voce precisar." },
                    ].map((item) => (
                        <div key={item.title} className="surface-card rounded-[1.8rem] p-6">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                                <item.icon className="h-5 w-5" />
                            </div>
                            <h3 className="mt-5 text-xl font-semibold text-foreground">{item.title}</h3>
                            <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    )
}

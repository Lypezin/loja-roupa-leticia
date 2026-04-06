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
                    <h1 className="mt-5 font-display text-4xl text-foreground md:text-6xl">Uma loja com ritmo mais humano</h1>
                    <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-muted-foreground">
                        A {storeName} nasceu da vontade de fazer moda com menos excesso visual e mais criterio: pecas que entram no dia a dia com naturalidade e ainda assim deixam presenca.
                    </p>
                </div>
            </section>

            <section className="py-12 md:py-16">
                <div className="grid gap-5 md:grid-cols-3">
                    {[
                        { icon: Sparkles, title: "Qualidade calma", desc: "Acabamento, tecido e proporcao antes de qualquer exagero de tendencia." },
                        { icon: Heart, title: "Curadoria real", desc: "Cada entrada precisa fazer sentido ao lado das outras, nao so chamar atencao sozinha." },
                        { icon: Users, title: "Relacao proxima", desc: "Atendimento claro, linguagem simples e uma marca que quer continuar vestindo bem depois da primeira compra." },
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

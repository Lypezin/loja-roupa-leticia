import { Heart, Sparkles, Users } from "lucide-react"
import { getStoreSettings } from "@/lib/storefront"

export const revalidate = 60

export default async function SobrePage() {
    const settings = await getStoreSettings()
    const storeName = settings?.store_name || "Fashion Store"

    return (
        <div className="page-shell py-8 md:py-12">
            <section className="paper-panel animate-enter-soft rounded-[2.4rem] px-6 py-10 md:px-10 md:py-14">
                <div className="mx-auto max-w-3xl text-center">
                    <span className="eyebrow justify-center">sobre a marca</span>
                    <h1 className="mt-5 font-display text-4xl text-foreground md:text-6xl">Uma loja feita para facilitar a escolha</h1>
                    <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-muted-foreground">
                        A {storeName} reune pecas femininas com leitura clara de foto, variacao e preco para a compra acontecer sem atrito.
                    </p>
                </div>
            </section>

            <section className="py-12 md:py-16">
                <div className="grid gap-5 md:grid-cols-3">
                    {[
                        { icon: Sparkles, title: "Escolha objetiva", desc: "Fotos diretas, informacoes visiveis e foco no que realmente ajuda a decidir." },
                        { icon: Heart, title: "Curadoria pratica", desc: "Modelos pensados para uso real, com combinacoes faceis no dia a dia." },
                        { icon: Users, title: "Contato proximo", desc: "Quando surge duvida, o atendimento responde sem linguagem enrolada." },
                    ].map((item, index) => (
                        <div key={item.title} className={`surface-card hover-lift-soft animate-enter-soft rounded-[1.8rem] p-6 ${index === 0 ? "" : index === 1 ? "animate-enter-delay-1" : "animate-enter-delay-2"}`}>
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

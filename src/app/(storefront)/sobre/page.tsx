import { createClient } from "@/lib/supabase/server"
import { Sparkles, Heart, Users } from "lucide-react"

export const revalidate = 60

export default async function SobrePage() {
    const supabase = await createClient()
    const { data: settings } = await supabase.from('store_settings').select('store_name, store_description').single()
    const storeName = settings?.store_name || 'Fashion Store'

    return (
        <div className="flex flex-col">
            {/* Hero */}
            <section className="relative h-[50vh] bg-zinc-950 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1558171813-4c088753af8f?auto=format&fit=crop&q=80&w=2070')] bg-cover bg-center opacity-40" />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent" />
                <div className="relative z-10 text-center max-w-2xl px-4">
                    <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-4">Nossa História</h1>
                    <p className="text-zinc-300 text-lg">Mais do que roupas — contamos histórias através do estilo.</p>
                </div>
            </section>

            {/* Valores */}
            <section className="container mx-auto px-4 py-12 md:py-20">
                <div className="max-w-3xl mx-auto">
                    <p className="text-lg text-muted-foreground leading-relaxed mb-12 text-center">
                        A <span className="font-semibold text-foreground">{storeName}</span> nasceu da
                        paixão por moda atemporal e acessível. Acreditamos que cada peça deve contar
                        uma história e fazer quem veste se sentir extraordinário. Nosso compromisso é
                        oferecer qualidade, conforto e estilo em cada detalhe.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { icon: Sparkles, title: "Qualidade Premium", desc: "Materiais selecionados e acabamento impecável em cada peça." },
                            { icon: Heart, title: "Paixão pelo Design", desc: "Cada coleção é pensada para inspirar e empoderar." },
                            { icon: Users, title: "Para Todos", desc: "Moda inclusiva que celebra a diversidade de estilos." },
                        ].map(item => (
                            <div key={item.title} className="text-center p-6 rounded-2xl bg-muted/50 border border-border">
                                <div className="w-12 h-12 bg-foreground rounded-xl flex items-center justify-center mx-auto mb-4">
                                    <item.icon className="w-5 h-5 text-background" />
                                </div>
                                <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}

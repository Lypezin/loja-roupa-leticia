import { createClient } from "@/lib/supabase/server"

export const revalidate = 60

export default async function SobrePage() {
    const supabase = await createClient()
    const { data: settings } = await supabase
        .from('store_settings')
        .select('store_name, store_description')
        .single()

    const storeName = settings?.store_name || 'LOJA MODA'

    return (
        <div className="container mx-auto px-4 py-16 max-w-2xl">
            <h1 className="text-4xl font-bold tracking-tight mb-8">Sobre Nós</h1>

            <div className="prose prose-zinc max-w-none space-y-6">
                <p className="text-lg text-zinc-600 leading-relaxed">
                    A <strong>{storeName}</strong> nasceu da paixão por moda minimalista e qualidade premium.
                    Acreditamos que roupas bem feitas contam histórias e transformam o dia a dia.
                </p>

                <div className="bg-zinc-50 p-8 rounded-2xl border space-y-4">
                    <h2 className="text-xl font-semibold">Nossa Missão</h2>
                    <p className="text-zinc-600">
                        Oferecer peças atemporais com caimento impecável, tecidos de alta qualidade e
                        preços justos. Cada detalhe é pensado para que você se sinta confiante.
                    </p>
                </div>

                <div className="bg-zinc-50 p-8 rounded-2xl border space-y-4">
                    <h2 className="text-xl font-semibold">Compromisso</h2>
                    <p className="text-zinc-600">
                        Trabalhamos com fornecedores éticos e sustentáveis.
                        A moda consciente é parte do nosso DNA.
                    </p>
                </div>
            </div>
        </div>
    )
}

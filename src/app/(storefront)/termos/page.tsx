import { createClient } from "@/lib/supabase/server"

export const revalidate = 3600

export default async function TermosPage() {
    const supabase = await createClient()
    const { data: settings } = await supabase
        .from('store_settings')
        .select('store_name')
        .single()

    const storeName = settings?.store_name || 'LOJA MODA'

    return (
        <div className="container mx-auto px-4 py-16 max-w-2xl">
            <h1 className="text-4xl font-bold tracking-tight mb-8">Termos de Uso</h1>

            <div className="prose prose-zinc max-w-none space-y-8 text-zinc-600">
                <section className="space-y-3">
                    <h2 className="text-xl font-semibold text-zinc-900">1. Aceitação dos Termos</h2>
                    <p>
                        Ao acessar e utilizar o site da {storeName}, você concorda com os termos e condições aqui descritos.
                        Caso não concorde, não utilize nossos serviços.
                    </p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-xl font-semibold text-zinc-900">2. Produtos e Preços</h2>
                    <p>
                        Os preços e disponibilidade dos produtos podem ser alterados sem aviso prévio.
                        Nos reservamos o direito de corrigir eventuais erros de precificação.
                    </p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-xl font-semibold text-zinc-900">3. Política de Trocas</h2>
                    <p>
                        Trocas podem ser solicitadas em até 7 dias corridos após o recebimento do produto,
                        desde que este esteja em sua embalagem original, sem sinais de uso.
                    </p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-xl font-semibold text-zinc-900">4. Privacidade</h2>
                    <p>
                        Seus dados pessoais são tratados com total sigilo e segurança.
                        Utilizamos criptografia e práticas recomendadas de proteção de dados
                        conforme a LGPD (Lei Geral de Proteção de Dados).
                    </p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-xl font-semibold text-zinc-900">5. Contato</h2>
                    <p>
                        Em caso de dúvidas sobre estes termos, entre em contato conosco através da
                        nossa página de contato.
                    </p>
                </section>

                <p className="text-sm text-zinc-400 pt-4 border-t">
                    Última atualização: {new Date().toLocaleDateString('pt-BR', { year: 'numeric', month: 'long' })}
                </p>
            </div>
        </div>
    )
}

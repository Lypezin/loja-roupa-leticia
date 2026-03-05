import { createClient } from "@/lib/supabase/server"
import Link from "next/link"

export const revalidate = 60

export default async function TermosPage() {
    const supabase = await createClient()
    const { data: settings } = await supabase.from('store_settings').select('store_name').single()
    const storeName = settings?.store_name || 'Fashion Store'

    const sections = [
        {
            title: "1. Aceitação dos Termos",
            content: `Ao acessar e utilizar o site da ${storeName}, você concorda com estes Termos de Uso. Caso não concorde, por favor, não utilize nossos serviços.`
        },
        {
            title: "2. Conta do Usuário",
            content: "Ao criar uma conta, você é responsável por manter a confidencialidade das suas credenciais de acesso. Todas as atividades realizadas na sua conta serão de sua responsabilidade."
        },
        {
            title: "3. Política de Preços",
            content: `Os preços exibidos no site da ${storeName} são válidos no momento da compra. Reservamo-nos o direito de alterar preços sem aviso prévio para compras futuras.`
        },
        {
            title: "4. Política de Troca e Devolução",
            content: "Produtos podem ser trocados ou devolvidos em até 7 dias após o recebimento, em conformidade com o Código de Defesa do Consumidor, desde que estejam em condições originais e com etiquetas."
        },
        {
            title: "5. Privacidade e Dados",
            content: "Seus dados pessoais são protegidos e utilizados exclusivamente para processamento de pedidos, comunicações sobre suas compras e melhorias do nosso serviço. Não compartilhamos suas informações com terceiros."
        },
        {
            title: "6. Propriedade Intelectual",
            content: `Todo o conteúdo do site — imagens, textos, logotipos e design — é propriedade da ${storeName} e não pode ser reproduzido sem autorização prévia.`
        },
    ]

    return (
        <div className="container mx-auto px-4 py-16 md:py-24">
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-14">
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400 mb-3 block">
                        Legal
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Termos de Uso</h1>
                    <p className="text-zinc-500">
                        Última atualização: Março de 2025
                    </p>
                </div>

                <div className="space-y-8">
                    {sections.map((section, i) => (
                        <div key={i} className="group">
                            <h2 className="text-lg font-semibold text-zinc-900 mb-3 flex items-center gap-3">
                                <span className="w-8 h-8 bg-zinc-100 rounded-lg flex items-center justify-center text-xs font-bold text-zinc-500 shrink-0">
                                    {i + 1}
                                </span>
                                {section.title.replace(/^\d+\.\s*/, '')}
                            </h2>
                            <p className="text-zinc-500 leading-relaxed pl-11">
                                {section.content}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="mt-14 p-6 bg-zinc-50 rounded-2xl border border-zinc-100 text-center">
                    <p className="text-sm text-zinc-500">
                        Dúvidas sobre os termos? Entre em contato pelo nosso{" "}
                        <Link href="/contato" className="text-zinc-900 font-semibold hover:underline">canal de atendimento</Link>.
                    </p>
                </div>
            </div>
        </div>
    )
}

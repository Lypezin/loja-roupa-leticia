import Link from "next/link"
import { getStoreSettings } from "@/lib/storefront"

export const revalidate = 60

export default async function TermosPage() {
    const settings = await getStoreSettings()
    const storeName = settings?.store_name || "Loja"

    const sections = [
        {
            title: "1. Aceitação dos termos",
            content: `Ao acessar e utilizar o site da ${storeName}, você concorda com estes Termos de Uso. Caso não concorde, por favor, não utilize nossos serviços.`,
        },
        {
            title: "2. Conta do usuário",
            content: "Ao criar uma conta, você é responsável por manter a confidencialidade das suas credenciais de acesso. Todas as atividades realizadas na sua conta serão de sua responsabilidade.",
        },
        {
            title: "3. Política de preços",
            content: `Os preços exibidos no site da ${storeName} são válidos no momento da compra. Reservamo-nos o direito de alterar preços sem aviso prévio para compras futuras.`,
        },
        {
            title: "4. Política de troca e devolução",
            content: "Produtos podem ser trocados ou devolvidos em até 7 dias após o recebimento, em conformidade com o Código de Defesa do Consumidor, desde que estejam em condições originais e com etiquetas.",
        },
        {
            title: "5. Privacidade e dados",
            content: "Seus dados pessoais são protegidos e utilizados exclusivamente para processamento de pedidos, comunicações sobre suas compras e melhorias do nosso serviço. Não compartilhamos suas informações com terceiros fora das integrações operacionais necessárias para pagamento e logística.",
        },
        {
            title: "6. Propriedade intelectual",
            content: `Todo o conteúdo do site, incluindo imagens, textos, logotipos e design, é propriedade da ${storeName} e não pode ser reproduzido sem autorização prévia.`,
        },
    ]

    return (
        <div className="container mx-auto px-4 py-16 md:py-24">
            <div className="mx-auto max-w-2xl">
                <div className="mb-14 text-center">
                    <span className="mb-3 block text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
                        Legal
                    </span>
                    <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">Termos de uso</h1>
                    <p className="text-zinc-500">Última atualização: 12 de abril de 2026</p>
                </div>

                <div className="space-y-8">
                    {sections.map((section, index) => (
                        <div key={section.title} className="group">
                            <h2 className="mb-3 flex items-center gap-3 text-lg font-semibold text-zinc-900">
                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-xs font-bold text-zinc-500">
                                    {index + 1}
                                </span>
                                {section.title.replace(/^\d+\.\s*/, "")}
                            </h2>
                            <p className="pl-11 leading-relaxed text-zinc-500">
                                {section.content}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="mt-14 rounded-2xl border border-zinc-100 bg-zinc-50 p-6 text-center">
                    <p className="text-sm text-zinc-500">
                        Dúvidas sobre os termos? Entre em contato pelo nosso{" "}
                        <Link href="/contato" className="font-semibold text-zinc-900 hover:underline">canal de atendimento</Link>.
                    </p>
                </div>
            </div>
        </div>
    )
}

import { MessageCircle, RefreshCcw, ShieldCheck, Truck } from "lucide-react"

const trustItems = [
  { icon: Truck, title: "Entrega para todo o Brasil", desc: "Frete claro e acompanhamento direto." },
  { icon: ShieldCheck, title: "Compra protegida", desc: "Pagamento seguro e fluxo objetivo." },
  { icon: RefreshCcw, title: "Troca assistida", desc: "Atendimento humano quando você precisa." },
  { icon: MessageCircle, title: "Suporte rápido", desc: "Resposta com linguagem simples e direta." },
]

export function TrustSection() {
  return (
    <section className="page-shell pb-14 md:pb-18">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {trustItems.map((item) => (
          <div key={item.title} className="surface-card rounded-[1.6rem] p-5 border border-muted/20">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
              <item.icon className="h-5 w-5" />
            </div>
            <h3 className="mt-5 text-lg font-semibold text-foreground">{item.title}</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

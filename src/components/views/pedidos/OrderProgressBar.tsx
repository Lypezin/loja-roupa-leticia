import { CreditCard, Package, Truck, CheckCircle } from "lucide-react"

const statusSteps = ["paid", "processing", "shipped", "delivered"]
const stepLabels: Record<string, string> = {
    paid: "Pago",
    processing: "Preparando",
    shipped: "Enviado",
    delivered: "Entregue",
}
const stepIcons = [CreditCard, Package, Truck, CheckCircle]

interface OrderProgressBarProps {
    status: string
}

export function OrderProgressBar({ status }: OrderProgressBarProps) {
    const currentStepIndex = statusSteps.indexOf(status)

    return (
        <div className="surface-card rounded-[1.8rem] p-6">
            <div className="grid gap-4 md:grid-cols-4">
                {statusSteps.map((step, index) => {
                    const Icon = stepIcons[index]
                    const isCompleted = currentStepIndex >= index

                    return (
                        <div key={step} className="surface-card-soft rounded-[1.4rem] p-4">
                            <div className={`flex h-11 w-11 items-center justify-center rounded-full ${isCompleted ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground"}`}>
                                <Icon className="h-4 w-4" />
                            </div>
                            <p className="mt-4 text-sm font-semibold text-foreground">{stepLabels[step]}</p>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

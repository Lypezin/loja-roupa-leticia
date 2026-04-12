import { MapPin, Clock } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface OriginAndProcessingFieldsProps {
    originZip: string
    processingDays: number
}

export function OriginAndProcessingFields({ originZip, processingDays }: OriginAndProcessingFieldsProps) {
    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
                <Label htmlFor="shipping_origin_zip" className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                    CEP de origem do despacho
                </Label>
                <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                    <Input
                        id="shipping_origin_zip"
                        name="shipping_origin_zip"
                        defaultValue={originZip}
                        placeholder="Ex.: 07081-170"
                        className="h-11 rounded-xl border-zinc-200 pl-10 focus-visible:ring-zinc-200"
                    />
                </div>
                <p className="text-[11px] leading-5 text-zinc-500">
                    Use o CEP do local de onde os pacotes realmente saem.
                </p>
            </div>

            <div className="space-y-2">
                <Label htmlFor="processing_days" className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                    Dias de preparação
                </Label>
                <div className="relative">
                    <Clock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                    <Input
                        id="processing_days"
                        name="processing_days"
                        type="number"
                        min="0"
                        defaultValue={processingDays}
                        className="h-11 rounded-xl border-zinc-200 pl-10 focus-visible:ring-zinc-200"
                    />
                </div>
                <p className="text-[11px] leading-5 text-zinc-500">
                    Prazo somado ao prazo da transportadora para separação e embalagem.
                </p>
            </div>
        </div>
    )
}

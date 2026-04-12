'use client'

import { Button } from "@/components/ui/button"
import type { CustomerProfile } from "@/lib/customer-profile"
import { ProfilePersonalSection } from "./ProfilePersonalSection"
import { ProfileAddressSection } from "./ProfileAddressSection"

interface ProfileFormProps {
    profile: CustomerProfile | null
    email: string
    nextPath: string
    metadata: Record<string, string | undefined>
    action: (formData: FormData) => Promise<void>
}

export function ProfileForm({ profile, email, nextPath, metadata, action }: ProfileFormProps) {
    return (
        <div className="surface-card rounded-[1.8rem] p-6 md:p-8">
            <form action={action} className="space-y-8">
                <input type="hidden" name="next" value={nextPath} />

                <div className="space-y-8">
                    <section className="space-y-4">
                        <h3 className="text-lg font-semibold text-foreground">Dados Pessoais</h3>
                        <ProfilePersonalSection profile={profile} email={email} />
                    </section>

                    <hr className="border-border" />

                    <section className="space-y-4">
                        <h3 className="text-lg font-semibold text-foreground">Endereço de Entrega</h3>
                        <ProfileAddressSection profile={profile} metadata={metadata} />
                    </section>
                </div>

                <div className="pt-4">
                    <Button type="submit" className="rounded-full px-8">
                        Salvar alterações
                    </Button>
                </div>
            </form>
        </div>
    )
}

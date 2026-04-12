import { redirect } from "next/navigation"
import { readCustomerProfile } from "@/lib/customer-profile"
import { createClient } from "@/lib/supabase/server"
import { getSafeRelativePath } from "@/lib/url-safety"
import { atualizarPerfil } from "./actions"
import { ProfileHeader } from "@/components/views/perfil/ProfileHeader"
import { StatusMessages } from "@/components/views/perfil/StatusMessages"
import { ProfileForm } from "@/components/views/perfil/ProfileForm"

export default async function PerfilPage({
    searchParams,
}: {
    searchParams: Promise<{ success?: string; error?: string; reason?: string; next?: string }>
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect("/conta/login")

    const params = await searchParams
    const nextPath = getSafeRelativePath(params?.next, "") || ""
    const profile = readCustomerProfile(user)
    const metadata = user.user_metadata && typeof user.user_metadata === "object"
        ? user.user_metadata as Record<string, string | undefined>
        : {}
    
    const warningMessage = params?.reason === "checkout_profile_required"
        ? "Preencha seus dados para continuar com o pagamento na AbacatePay."
        : null

    return (
        <div className="page-shell py-10 md:py-14">
            <div className="mx-auto max-w-3xl space-y-6">
                <ProfileHeader />

                <StatusMessages 
                    warningMessage={warningMessage}
                    successMessage={params?.success}
                    errorMessage={params?.error}
                />

                <ProfileForm 
                    profile={profile}
                    email={user.email || ""}
                    nextPath={nextPath}
                    metadata={metadata}
                    action={atualizarPerfil}
                />
            </div>
        </div>
    )
}

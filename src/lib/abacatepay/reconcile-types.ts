import type { Database } from "@/lib/supabase/database.types"
import type { PaymentEventProcessingResult } from "./webhook-handlers"

export type PaymentAttemptRow = Database["public"]["Tables"]["payment_attempts"]["Row"]

export type NormalizedAttemptStatus = "completed" | "refunded" | "disputed" | "failed" | "pending"

export type ReconcileAttemptResult = PaymentEventProcessingResult & {
    status: "matched" | "missing_attempt" | "billing_not_found"
    providerStatus?: string | null
    normalizedStatus?: NormalizedAttemptStatus
}

export type ReconcilePendingOptions = {
    limit?: number
    minAgeMs?: number
    userId?: string
}

export type ReconcilePendingSummary = {
    checked: number
    matched: number
    completed: number
    refunded: number
    disputed: number
    failed: number
    pending: number
    billingNotFound: number
    ignored: number
    errors: string[]
}

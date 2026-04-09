# LS Store Vendas Online

E-commerce em Next.js com Supabase no backend e checkout hospedado pela AbacatePay.

## Stack principal

- Next.js App Router
- Supabase para auth, banco e storage
- AbacatePay para checkout hospedado e webhooks
- Tailwind CSS + componentes customizados

## Setup local

1. Instale as dependencias:

```bash
npm ci
```

2. Copie `.env.example` para `.env.local` e preencha:

```bash
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ABACATEPAY_API_KEY=
ABACATEPAY_WEBHOOK_SECRET=
ABACATEPAY_HMAC_PUBLIC_KEY=
ABACATEPAY_PAYMENT_METHODS=PIX,CARD
```

3. Rode o projeto:

```bash
npm run dev
```

## Pagamentos

O checkout do storefront cria uma `payment_attempt` confiavel no Supabase, gera a cobranca na AbacatePay e aguarda a confirmacao do webhook para transformar a tentativa em pedido real.

### Endpoint de webhook

Use este endpoint na AbacatePay:

```text
https://SEU-DOMINIO/api/webhooks/abacatepay?webhookSecret=SEU_SEGREDO
```

Requisitos:

- `ABACATEPAY_WEBHOOK_SECRET` deve bater com o `webhookSecret` enviado na URL
- `ABACATEPAY_HMAC_PUBLIC_KEY` valida o header `X-Webhook-Signature`
- o servidor precisa de `SUPABASE_SERVICE_ROLE_KEY` para finalizar pedidos com a RPC `finalize_payment_order`

### Metodos de pagamento

- `PIX` e `CARD` sao suportados no codigo
- se sua conta ainda nao tiver cartao liberado, configure `ABACATEPAY_PAYMENT_METHODS=PIX`

## Banco e migrations

As migrations oficiais ficam em `supabase/migrations`.

Arquivos SQL em `src/sql/` servem como referencia operacional. O arquivo `src/sql/create_pedidos.sql` foi mantido apenas como historico neutro e nao deve mais ser executado.

## Validacoes uteis

```bash
npx tsc --noEmit
npx eslint src/app/api/webhooks/abacatepay/route.ts src/app/(storefront)/sucesso/page.tsx src/app/(storefront)/sucesso/ClearCart.tsx
npm run build
```

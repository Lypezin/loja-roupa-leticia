# Checklist Operacional de Seguranca

## Supabase Auth

- Habilitar `Leaked password protection`.
- Confirmar politica de `email confirmation` de acordo com a experiencia desejada da loja.
- Conferir `Site URL` para o dominio oficial da aplicacao.
- Revisar `Redirect URLs` permitidas e remover hosts de teste que nao sao mais necessarios.
- Confirmar que a conta `admin@admin.com` permanece com `app_metadata.role = admin`.

## Banco e RLS

- Conferir se a ultima migracao aplicada em producao e [supabase/migrations/20260406120000_security_hardening.sql](./../../supabase/migrations/20260406120000_security_hardening.sql).
- Validar leitura publica apenas para vitrine e assets.
- Validar que usuario autenticado comum nao consegue escrever em `products`, `product_variations`, `product_images`, `store_settings`, `orders` ou `order_items`.
- Validar que admin autenticado com claim correta consegue operar o painel normalmente.
- Confirmar que apenas `service_role` e `postgres` possuem `EXECUTE` em `public.decrement_stock`.

## Storage

- Confirmar bucket `product-images` com:
  - `public = true`
  - `file_size_limit = 5242880`
  - MIME types limitados a `image/jpeg`, `image/png`, `image/webp`, `image/avif`, `image/gif`
- Testar upload por admin.
- Testar bloqueio de upload, update e delete para usuario autenticado comum.

## Stripe

- Confirmar `STRIPE_SECRET_KEY` e `STRIPE_WEBHOOK_SECRET` no ambiente server-side.
- Conferir no dashboard Stripe que o endpoint de webhook aponta para a URL oficial da aplicacao.
- Garantir assinatura ativa para eventos:
  - `checkout.session.completed`
  - `checkout.session.async_payment_succeeded`
  - `checkout.session.async_payment_failed`
  - `charge.refunded`
- Executar replay controlado de webhook e confirmar idempotencia por `stripe_session_id`.

## Deploy e secrets

- Garantir que `SUPABASE_SERVICE_ROLE_KEY` nunca esteja exposta em bundle cliente.
- Garantir que `NEXT_PUBLIC_SITE_URL` use o dominio oficial correto.
- Rotacionar chaves se alguma credencial tiver sido exposta durante homologacao.
- Verificar segregacao entre ambientes de dev, staging e producao.

## Testes recomendados apos deploy

- Checkout anonimo completo.
- Checkout autenticado completo.
- Leitura de pedidos proprios.
- Bloqueio de leitura de pedidos alheios.
- Atualizacao de status de pedido no admin.
- Upload e remocao de imagens no admin.

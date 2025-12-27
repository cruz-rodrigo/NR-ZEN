
# Roteiro de Testes: Stripe Lifecycle (NR ZEN)

Este documento descreve como validar o fluxo completo de faturamento usando o modo Teste do Stripe.

## 1. Checkout (Novas Assinaturas)
- **Consultor Mensal**: 
  - Acesse Billing, selecione Mensal, clique em Consultor.
  - No Stripe, use o cartão `4242...`.
  - Após sucesso, o sistema deve mostrar "Validando Pagamento" e liberar o Dashboard.
- **Business Anual**:
  - Validar se o valor cobrado é R$ 5.970,00.
  - Verificar no banco se `plan_tier` virou `business`.

## 2. Webhooks e Lifecycle
- **Cancelamento**:
  - No App, clique em "Gestão de Faturas" -> Abre o Portal Stripe.
  - Cancele a assinatura no portal.
  - Ao retornar ao app, o status deve ser "Cancelada".
- **Falha de Pagamento**:
  - Simule no Stripe Dashboard uma falha de fatura (Invoice -> Fail).
  - O `plan_status` no Supabase deve mudar para `past_due`.

## 3. Validação no Banco de Dados (Supabase)
Verifique os seguintes campos na tabela `users` após um teste:
1. `stripe_customer_id`: Deve começar com `cus_...`
2. `stripe_subscription_id`: Deve começar com `sub_...`
3. `plan_status`: Deve ser `active`.
4. `current_period_end`: Deve ser uma data no futuro.

## 4. Endpoints Testados
- `POST /api/checkout/create-session`: Criação e reaproveitamento de customer.
- `POST /api/stripe/portal`: Acesso ao autoatendimento.
- `POST /api/webhooks/stripe`: Sincronização em tempo real.

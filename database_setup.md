# Configuração do Banco de Dados (Supabase)

> **Nota:** Se você já executou os scripts anteriores, vá direto para a **Parte 4** ou **Parte 6**.

## 1. Tabela de Perfis (Padrão Supabase Auth)
*(Se você já rodou, pule esta etapa)*

```sql
create table public.profiles (
  id uuid not null references auth.users on delete cascade,
  name text,
  email text,
  plan_tier text default 'free',
  created_at timestamptz default now(),
  primary key (id)
);

alter table public.profiles enable row level security;
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, email, plan_tier)
  values (new.id, new.raw_user_meta_data->>'name', new.email, 'free');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

## 2. Tabelas Principais (Empresas e Setores)
*(Se você já rodou, pule esta etapa)*

```sql
create table public.companies (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null, -- Alterado para permitir flexibilidade no auth
  name text not null,
  cnpj text not null,
  status text default 'active',
  created_at timestamptz default now()
);

-- Se já criou a tabela companies antes e deu erro de FK, rode:
-- alter table public.companies drop constraint companies_user_id_fkey;

alter table public.companies enable row level security;
create policy "Enable all access for authenticated users" on public.companies for all using (true);

create table public.sectors (
  id uuid default gen_random_uuid() primary key,
  company_id uuid references public.companies on delete cascade not null,
  name text not null,
  employees_count int default 0,
  created_at timestamptz default now()
);

alter table public.sectors enable row level security;
create policy "Enable all access for authenticated users" on public.sectors for all using (true);
```

## 3. Avaliações e Respostas
*(Se você já rodou, pule esta etapa)*

```sql
create table public.surveys (
  id uuid default gen_random_uuid() primary key,
  sector_id uuid references public.sectors not null,
  access_code text unique not null,
  active boolean default true,
  expires_at timestamptz,
  created_at timestamptz default now()
);

alter table public.surveys enable row level security;
create policy "Enable read access for all" on public.surveys for select using (true);

create table public.survey_responses (
  id uuid default gen_random_uuid() primary key,
  survey_id uuid references public.surveys not null,
  answers jsonb not null,
  risk_score int,
  created_at timestamptz default now()
);

alter table public.survey_responses enable row level security;
create policy "Public insert responses" on public.survey_responses for insert with check (true);
```

---

## 4. Tabelas Extras (ESSENCIAIS para o código atual)
**Execute este bloco para que o Login e o Dashboard funcionem com o código Node.js fornecido.**

```sql
-- 4.1 Tabela de Usuários Customizada (Usada pelo api/auth/register.ts)
create table public.users (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text unique not null,
  password_hash text not null,
  plan_tier text default 'free',
  created_at timestamptz default now()
);

alter table public.users enable row level security;
create policy "Public read users" on public.users for select using (true);
create policy "Public insert users" on public.users for insert with check (true);

-- 4.2 Tabela de Analítica do Setor (Usada pelo Dashboard api/dashboard/stats.ts)
create table public.sector_analytics (
  id uuid default gen_random_uuid() primary key,
  sector_id uuid references public.sectors on delete cascade,
  risk_level text, -- 'low', 'moderate', 'high'
  score int,
  last_updated timestamptz default now()
);

alter table public.sector_analytics enable row level security;
create policy "Enable read access" on public.sector_analytics for select using (true);

-- 4.3 Plano de Ação (Gestão de Riscos)
create table public.action_plans (
  id uuid default gen_random_uuid() primary key,
  sector_id uuid references public.sectors on delete cascade not null,
  domain text,
  risk text,
  action text,
  responsible text,
  deadline text,
  status text DEFAULT 'Pendente',
  created_at timestamptz default now()
);

alter table public.action_plans enable row level security;
create policy "Enable all access" on public.action_plans for all using (true);

-- 4.4 Ajuste de Referência (Opcional: Apenas se deu erro ao inserir empresa)
do $$
begin
  if exists (select 1 from information_schema.table_constraints where constraint_name = 'companies_user_id_fkey') then
    alter table public.companies drop constraint companies_user_id_fkey;
  end if;
end $$;
```

---

## 5. Configuração de Produção (Vercel)

Para que a API funcione no Vercel, você deve configurar as variáveis de ambiente manualmente.

1. Vá no painel do Vercel > Settings > **Environment Variables**.
2. Adicione as seguintes chaves (obtidas no painel do Supabase > Project Settings > API):

| Key | Value (Origem: Supabase) |
| :--- | :--- |
| `VITE_SUPABASE_URL` | Project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | `service_role` secret (NÃO use a anon key) |

3. **IMPORTANTE:** Após adicionar as variáveis, vá na aba **Deployments** do Vercel, clique nos três pontos (...) do último deploy e selecione **Redeploy**.

---

## 6. Metadados do Questionário (Novo)
**Recomendado: Execute este bloco para tornar o questionário dinâmico.**

Este script inclui comandos de limpeza (`DROP`) para garantir que as tabelas sejam recriadas corretamente caso já existam.

```sql
-- 1. Limpeza Segura (Remove tabelas antigas se existirem para evitar conflitos)
ALTER TABLE IF EXISTS public.surveys DROP CONSTRAINT IF EXISTS surveys_template_id_fkey;
DROP TABLE IF EXISTS public.questions;
DROP TABLE IF EXISTS public.domains;
DROP TABLE IF EXISTS public.questionnaire_templates;

-- 2. Recriar Tabela de Templates
CREATE TABLE public.questionnaire_templates (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  active boolean default true,
  created_at timestamptz default now()
);

-- 3. Recriar Tabela de Domínios
CREATE TABLE public.domains (
  id serial primary key,
  template_id uuid references public.questionnaire_templates on delete cascade not null,
  name text not null,
  weight float default 1.0,
  created_at timestamptz default now()
);

-- 4. Recriar Tabela de Perguntas
CREATE TABLE public.questions (
  id text primary key, -- ex: "D1_Q1"
  domain_id int references public.domains on delete cascade not null,
  text text not null,
  type text not null check (type in ('positive', 'negative')),
  created_at timestamptz default now()
);

-- 5. Atualizar Tabela Surveys (Adicionar coluna se não existir)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='surveys' AND column_name='template_id') THEN
        ALTER TABLE public.surveys ADD COLUMN template_id uuid REFERENCES public.questionnaire_templates;
    ELSE
        -- Se a coluna já existe, adicionamos a FK novamente (pois a tabela templates foi recriada)
        ALTER TABLE public.surveys DROP CONSTRAINT IF EXISTS surveys_template_id_fkey;
        ALTER TABLE public.surveys ADD CONSTRAINT surveys_template_id_fkey FOREIGN KEY (template_id) REFERENCES public.questionnaire_templates(id);
    END IF;
END $$;

-- 6. Habilitar Segurança (RLS)
ALTER TABLE public.questionnaire_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read access templates" ON public.questionnaire_templates;
CREATE POLICY "Public read access templates" ON public.questionnaire_templates FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read access domains" ON public.domains;
CREATE POLICY "Public read access domains" ON public.domains FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read access questions" ON public.questions;
CREATE POLICY "Public read access questions" ON public.questions FOR SELECT USING (true);

-- 7. Popular com Dados (Seed)
DO $$
DECLARE
  v_template_id uuid;
  v_dom1_id int; v_dom2_id int; v_dom3_id int;
  v_dom4_id int; v_dom5_id int; v_dom6_id int;
BEGIN
  -- Template Padrão
  INSERT INTO public.questionnaire_templates (name, description)
  VALUES ('Modelo Padrão NR-17', 'Avaliação completa de fatores psicossociais.')
  RETURNING id INTO v_template_id;

  -- Domínios
  INSERT INTO public.domains (template_id, name) VALUES (v_template_id, 'Demandas e ritmo de trabalho') RETURNING id INTO v_dom1_id;
  INSERT INTO public.domains (template_id, name) VALUES (v_template_id, 'Autonomia e controle') RETURNING id INTO v_dom2_id;
  INSERT INTO public.domains (template_id, name) VALUES (v_template_id, 'Apoio da liderança e da organização') RETURNING id INTO v_dom3_id;
  INSERT INTO public.domains (template_id, name) VALUES (v_template_id, 'Relações e clima social') RETURNING id INTO v_dom4_id;
  INSERT INTO public.domains (template_id, name) VALUES (v_template_id, 'Reconhecimento e justiça') RETURNING id INTO v_dom5_id;
  INSERT INTO public.domains (template_id, name) VALUES (v_template_id, 'Equilíbrio trabalho–vida pessoal') RETURNING id INTO v_dom6_id;

  -- Perguntas (Domínio 1)
  INSERT INTO public.questions (domain_id, id, text, type) VALUES
  (v_dom1_id, 'D1_Q1', 'Sinto que o volume de trabalho é adequado para a minha jornada.', 'positive'),
  (v_dom1_id, 'D1_Q2', 'Tenho prazos tão apertados que preciso correr o tempo todo para cumpri-los.', 'negative'),
  (v_dom1_id, 'D1_Q3', 'Consigo fazer pausas suficientes ao longo do trabalho.', 'positive'),
  (v_dom1_id, 'D1_Q4', 'Com frequência levo preocupações do trabalho para casa por excesso de demanda.', 'negative'),
  (v_dom1_id, 'D1_Q5', 'As mudanças de prioridade acontecem de forma planejada e comunicada.', 'positive');

  -- Domínio 2
  INSERT INTO public.questions (domain_id, id, text, type) VALUES
  (v_dom2_id, 'D2_Q1', 'Tenho liberdade para decidir como organizar minhas tarefas.', 'positive'),
  (v_dom2_id, 'D2_Q2', 'Eu me sinto microgerenciado(a) na maior parte do tempo.', 'negative'),
  (v_dom2_id, 'D2_Q3', 'Posso opinar sobre a forma como o trabalho é feito no meu setor.', 'positive'),
  (v_dom2_id, 'D2_Q4', 'Mudanças importantes no trabalho acontecem sem que eu seja consultado(a).', 'negative'),
  (v_dom2_id, 'D2_Q5', 'Tenho clareza sobre quais resultados são esperados de mim.', 'positive');

  -- Domínio 3
  INSERT INTO public.questions (domain_id, id, text, type) VALUES
  (v_dom3_id, 'D3_Q1', 'Minha liderança direta está disponível para apoiar quando surgem dificuldades.', 'positive'),
  (v_dom3_id, 'D3_Q2', 'Quando há problemas, a culpa é rapidamente colocada nas pessoas, não nos processos.', 'negative'),
  (v_dom3_id, 'D3_Q3', 'Recebo orientações claras quando algo precisa ser ajustado no meu trabalho.', 'positive'),
  (v_dom3_id, 'D3_Q4', 'Sinto que posso falar abertamente sobre problemas de trabalho sem medo de represálias.', 'positive'),
  (v_dom3_id, 'D3_Q5', 'Quando peço ajuda, costumo receber respostas do tipo "se vira".', 'negative');

  -- Domínio 4
  INSERT INTO public.questions (domain_id, id, text, type) VALUES
  (v_dom4_id, 'D4_Q1', 'O clima entre colegas é respeitoso na maior parte do tempo.', 'positive'),
  (v_dom4_id, 'D4_Q2', 'Já presenciei ou sofri situações de desrespeito ou humilhação no trabalho.', 'negative'),
  (v_dom4_id, 'D4_Q3', 'Conflitos entre pessoas são tratados de forma construtiva.', 'positive'),
  (v_dom4_id, 'D4_Q4', 'Costumo evitar falar com algumas pessoas por medo de como vão reagir.', 'negative'),
  (v_dom4_id, 'D4_Q5', 'Sinto que faço parte de uma equipe, não apenas de um grupo de pessoas.', 'positive');

  -- Domínio 5
  INSERT INTO public.questions (domain_id, id, text, type) VALUES
  (v_dom5_id, 'D5_Q1', 'Sinto que meu esforço é reconhecido de alguma forma.', 'positive'),
  (v_dom5_id, 'D5_Q2', 'Percebo diferenças injustas de tratamento entre pessoas ou áreas.', 'negative'),
  (v_dom5_id, 'D5_Q3', 'As decisões importantes (promoções, mudanças de função) parecem justas e transparentes.', 'positive'),
  (v_dom5_id, 'D5_Q4', 'Recebo retorno (feedback) com frequência suficiente para me desenvolver.', 'positive'),
  (v_dom5_id, 'D5_Q5', 'Às vezes sinto que "tanto faz" o que eu faço, nada muda.', 'negative');

  -- Domínio 6
  INSERT INTO public.questions (domain_id, id, text, type) VALUES
  (v_dom6_id, 'D6_Q1', 'Em geral, consigo equilibrar as demandas de trabalho com minha vida pessoal.', 'positive'),
  (v_dom6_id, 'D6_Q2', 'Costumo fazer horas extras frequentes sem planejamento.', 'negative'),
  (v_dom6_id, 'D6_Q3', 'Tenho flexibilidade para lidar com imprevistos pessoais quando necessário.', 'positive'),
  (v_dom6_id, 'D6_Q4', 'Fico pensando em problemas do trabalho mesmo fora do horário.', 'negative'),
  (v_dom6_id, 'D6_Q5', 'Sinto que a organização se preocupa com o equilíbrio entre trabalho e vida pessoal.', 'positive');

END $$;
```
# Configuração do Banco de Dados (Supabase)

> **Nota:** Se você já executou os scripts anteriores, vá direto para a **Parte 4**.

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

O código da aplicação (`api/auth` e `api/dashboard`) espera estas tabelas específicas:

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

-- 4.3 Ajuste de Referência (Opcional: Apenas se deu erro ao inserir empresa)
-- Como estamos usando uma tabela 'users' própria e não o 'auth.users' do Supabase,
-- precisamos garantir que a tabela companies não esteja travada no auth do Supabase.
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
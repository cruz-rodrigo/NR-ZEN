# Configuração do Banco de Dados (Supabase)

Para evitar erros de script longo, execute estes blocos separadamente no **SQL Editor** do Supabase.

## 1. Tabela de Perfis (Opcional - Extensão do Auth)

```sql
-- Cria uma tabela pública de perfis ligada ao auth.users
create table public.profiles (
  id uuid not null references auth.users on delete cascade,
  name text,
  email text,
  plan_tier text default 'free',
  created_at timestamptz default now(),
  primary key (id)
);

-- RLS: Segurança
alter table public.profiles enable row level security;
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- Trigger para criar perfil automaticamente ao cadastrar
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

```sql
create table public.companies (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  name text not null,
  cnpj text not null,
  status text default 'active',
  created_at timestamptz default now()
);

alter table public.companies enable row level security;
create policy "Users manage their own companies" on public.companies
  using (auth.uid() = user_id);

create table public.sectors (
  id uuid default gen_random_uuid() primary key,
  company_id uuid references public.companies on delete cascade not null,
  name text not null,
  employees_count int default 0,
  created_at timestamptz default now()
);

alter table public.sectors enable row level security;
create policy "Users manage sectors via company" on public.sectors
  using (exists (select 1 from public.companies where id = sectors.company_id and user_id = auth.uid()));
```

## 3. Avaliações e Respostas

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
create policy "Users manage surveys via company" on public.surveys
  using (exists (
    select 1 from public.sectors s
    join public.companies c on c.id = s.company_id
    where s.id = surveys.sector_id and c.user_id = auth.uid()
  ));

create table public.survey_responses (
  id uuid default gen_random_uuid() primary key,
  survey_id uuid references public.surveys not null,
  answers jsonb not null, -- Salva as respostas como JSON
  risk_score int,
  created_at timestamptz default now()
);

-- Permitir inserção anônima (importante para quem responde o questionário)
alter table public.survey_responses enable row level security;
create policy "Public insert responses" on public.survey_responses for insert with check (true);
```

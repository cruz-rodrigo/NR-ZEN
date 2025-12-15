import React, { useState } from 'react';
import Layout from '../components/Layout';
import Button from '../components/Button';
import Card from '../components/Card';
import { Database, CheckCircle2, AlertTriangle, Loader2, ServerCrash, Save, Copy } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const REQUIRED_SQL = `-- SCRIPT COMPLETO PARA RECRIAR O BANCO (BASEADO NO ERD)

-- 1. TABELAS BÁSICAS
create table if not exists public.users (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text unique not null,
  password_hash text not null,
  plan_tier text default 'free',
  created_at timestamptz default now()
);

create table if not exists public.companies (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null, 
  name text not null,
  cnpj text not null,
  status text default 'active',
  created_at timestamptz default now()
);

create table if not exists public.sectors (
  id uuid default gen_random_uuid() primary key,
  company_id uuid references public.companies on delete cascade not null,
  name text not null,
  employees_count int default 0,
  created_at timestamptz default now()
);

-- 2. QUESTIONÁRIOS E TEMPLATES
create table if not exists public.questionnaire_templates (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  active boolean default true,
  created_at timestamptz default now()
);

create table if not exists public.domains (
  id serial primary key,
  template_id uuid references public.questionnaire_templates on delete cascade not null,
  name text not null,
  weight float default 1.0,
  created_at timestamptz default now()
);

create table if not exists public.questions (
  id text primary key,
  domain_id int references public.domains on delete cascade not null,
  text text not null,
  type text not null check (type in ('positive', 'negative')),
  created_at timestamptz default now()
);

create table if not exists public.surveys (
  id uuid default gen_random_uuid() primary key,
  sector_id uuid references public.sectors not null,
  template_id uuid references public.questionnaire_templates,
  access_code text unique not null,
  active boolean default true,
  expires_at timestamptz,
  created_at timestamptz default now()
);

-- 3. RESPOSTAS E DADOS
create table if not exists public.survey_responses (
  id uuid default gen_random_uuid() primary key,
  survey_id uuid references public.surveys not null,
  answers jsonb not null,
  risk_score int,
  created_at timestamptz default now()
);

create table if not exists public.sector_analytics (
  id uuid default gen_random_uuid() primary key,
  sector_id uuid references public.sectors on delete cascade,
  risk_level text,
  score int,
  last_updated timestamptz default now()
);

create table if not exists public.action_plans (
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

-- 4. POLÍTICAS DE SEGURANÇA (SIMPLIFICADO PARA INÍCIO)
alter table public.users enable row level security;
create policy "Public access users" on public.users for all using (true);

alter table public.companies enable row level security;
create policy "Enable all access" on public.companies for all using (true);

alter table public.sectors enable row level security;
create policy "Enable all access" on public.sectors for all using (true);

alter table public.surveys enable row level security;
create policy "Enable all access" on public.surveys for all using (true);

alter table public.survey_responses enable row level security;
create policy "Enable all access" on public.survey_responses for all using (true);

alter table public.action_plans enable row level security;
create policy "Enable all access" on public.action_plans for all using (true);

alter table public.sector_analytics enable row level security;
create policy "Enable all access" on public.sector_analytics for all using (true);

alter table public.questionnaire_templates enable row level security;
create policy "Public read templates" on public.questionnaire_templates for select using (true);

alter table public.domains enable row level security;
create policy "Public read domains" on public.domains for select using (true);

alter table public.questions enable row level security;
create policy "Public read questions" on public.questions for select using (true);
`;

const TestDb: React.FC = () => {
  const { apiCall } = useAuth(); // Usa helper, mas para teste bruto usamos fetch direto para evitar auth check
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error' | 'missing_table'>('idle');
  const [writeStatus, setWriteStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [result, setResult] = useState<any>(null);
  const [writeResult, setWriteResult] = useState<any>(null);

  const runReadTest = async () => {
    setStatus('loading');
    setResult(null);
    setWriteStatus('idle');
    try {
      const response = await fetch('/api/test-db');
      const text = await response.text();
      let data;
      try { data = JSON.parse(text); } catch { data = { message: 'Erro HTML (500)', raw: text.slice(0,200) }; }
      
      setResult(data);
      
      if (data.status === 'success') setStatus('success');
      else if (data.status === 'missing_table') setStatus('missing_table');
      else setStatus('error');

    } catch (error: any) {
      setStatus('error');
      setResult({ message: 'Erro de Rede', details: error.message });
    }
  };

  const runWriteTest = async () => {
    setWriteStatus('loading');
    try {
      const response = await fetch('/api/test-db', { method: 'POST' });
      const data = await response.json();
      setWriteResult(data);

      if (data.status === 'success') setWriteStatus('success');
      else setWriteStatus('error');
    } catch (error: any) {
      setWriteStatus('error');
      setWriteResult({ message: 'Erro de Rede no POST', details: error.message });
    }
  };

  const copySql = () => {
    navigator.clipboard.writeText(REQUIRED_SQL);
    alert('SQL completo copiado! Cole no "SQL Editor" do painel Supabase.');
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto py-12">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-heading font-bold text-slate-800 flex items-center justify-center gap-3">
            <Database className="text-blue-600" />
            Diagnóstico de Banco de Dados
          </h1>
          <p className="text-slate-500 mt-2">
            Verifique a conexão e sincronize o esquema com o ERD oficial.
          </p>
        </header>

        <div className="space-y-8">
          {/* TESTE DE CONEXÃO E LEITURA */}
          <Card className="text-center p-8 shadow-md border-t-4 border-t-blue-500">
            <h2 className="text-xl font-bold text-slate-800 mb-4">1. Teste de Conexão</h2>
            
            {status === 'idle' && (
              <Button onClick={runReadTest} size="lg">Iniciar Diagnóstico</Button>
            )}

            {status === 'loading' && (
              <div className="flex flex-col items-center text-blue-600">
                <Loader2 className="animate-spin mb-2" size={32} />
                <span className="font-bold">Verificando Vercel & Supabase...</span>
              </div>
            )}

            {status === 'success' && (
              <div className="animate-fade-in-down">
                <div className="flex items-center justify-center gap-2 text-emerald-600 font-bold text-lg mb-2">
                  <CheckCircle2 size={24} /> Conexão OK!
                </div>
                <p className="text-slate-600 text-sm mb-4">{result?.details}</p>
                <div className="bg-slate-100 rounded p-2 text-xs font-mono text-slate-500 overflow-hidden text-ellipsis whitespace-nowrap max-w-md mx-auto">
                  URL: {result?.debug?.urlPreview}
                </div>
              </div>
            )}

            {status === 'missing_table' && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-left animate-fade-in-down">
                <div className="flex items-start gap-3 mb-4">
                  <AlertTriangle className="text-amber-600 shrink-0" size={24} />
                  <div>
                    <h3 className="font-bold text-amber-800 text-lg">Tabelas não encontradas!</h3>
                    <p className="text-amber-700 text-sm mt-1">
                      O Vercel conectou ao Supabase, mas o banco parece incompleto. Use o script abaixo para criar toda a estrutura (Action Plans, Templates, etc).
                    </p>
                  </div>
                </div>
                
                <div className="bg-slate-900 rounded-lg p-4 relative group">
                  <pre className="text-emerald-400 font-mono text-xs overflow-x-auto h-48 custom-scrollbar">
                    {REQUIRED_SQL}
                  </pre>
                  <button onClick={copySql} className="absolute top-2 right-2 bg-white/10 hover:bg-white/20 text-white p-2 rounded transition-colors" title="Copiar SQL Completo">
                    <Copy size={16} />
                  </button>
                </div>
                <p className="text-center mt-4 text-sm text-slate-500">Copie o código acima e rode no <strong>SQL Editor</strong> do Supabase.</p>
                <div className="mt-4 text-center">
                  <Button onClick={runReadTest} variant="secondary">Verificar Novamente</Button>
                </div>
              </div>
            )}

            {status === 'error' && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-left animate-fade-in-down">
                 <h3 className="font-bold text-red-800 flex items-center gap-2"><ServerCrash size={20}/> Erro de Conexão</h3>
                 <p className="text-sm text-red-700 mt-2 mb-4">{result?.message}</p>
                 <pre className="bg-white p-3 rounded border border-red-100 text-xs text-red-600 overflow-auto">{JSON.stringify(result, null, 2)}</pre>
                 
                 <div className="text-left text-sm text-slate-600 mt-4 space-y-3 bg-white p-4 rounded border border-slate-200">
                    <p className="font-bold flex items-center gap-2"><AlertTriangle size={16}/> Verifique as Variáveis:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>No Vercel (Production/Preview): Adicione <code>NEXT_PUBLIC_SUPABASE_URL</code> e <code>SUPABASE_SECRET_KEY</code>.</li>
                      <li>Localmente: Verifique se o arquivo <code>.env.local</code> está na raiz.</li>
                    </ul>
                 </div>

                 <div className="mt-4 text-center">
                   <Button onClick={runReadTest} variant="danger">Tentar Novamente</Button>
                 </div>
              </div>
            )}
          </Card>

          {/* TESTE DE GRAVAÇÃO */}
          {status === 'success' && (
            <Card className="text-center p-8 shadow-md border-t-4 border-t-emerald-500 animate-in fade-in slide-in-from-bottom-4">
              <h2 className="text-xl font-bold text-slate-800 mb-2">2. Teste de Gravação (Escrita)</h2>
              <p className="text-slate-500 text-sm mb-6">Tenta salvar um usuário de teste e apagá-lo em seguida.</p>

              {writeStatus === 'idle' && (
                 <Button onClick={runWriteTest} size="lg" className="bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20">
                   <Save size={18} className="mr-2" /> Testar Gravação
                 </Button>
              )}

              {writeStatus === 'loading' && (
                <div className="flex flex-col items-center text-emerald-600">
                  <Loader2 className="animate-spin mb-2" size={32} />
                  <span className="font-bold">Gravando dados...</span>
                </div>
              )}

              {writeStatus === 'success' && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                  <div className="flex items-center justify-center gap-2 text-emerald-700 font-bold mb-2">
                     <CheckCircle2 /> Sucesso!
                  </div>
                  <p className="text-emerald-800 text-sm">{writeResult?.details}</p>
                  <p className="text-emerald-600 text-xs mt-2">O sistema está pronto para cadastrar usuários e empresas.</p>
                </div>
              )}

              {writeStatus === 'error' && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center justify-center gap-2 text-red-700 font-bold mb-2">
                     <AlertTriangle /> Falha na Gravação
                  </div>
                  <p className="text-red-800 text-sm">{writeResult?.message}</p>
                  <pre className="text-xs text-red-600 mt-2 text-left bg-white p-2 rounded">{JSON.stringify(writeResult?.details, null, 2)}</pre>
                </div>
              )}
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default TestDb;
import React, { useState } from 'react';
import Layout from '../components/Layout';
import Button from '../components/Button';
import Card from '../components/Card';
import { Database, CheckCircle2, AlertTriangle, Loader2, ServerCrash } from 'lucide-react';

const TestDb: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [result, setResult] = useState<any>(null);

  const runTest = async () => {
    setStatus('loading');
    setResult(null);
    try {
      const response = await fetch('/api/test-db');
      
      // Primeiro pegamos o texto puro para evitar erro de parse JSON se o Vercel devolver HTML
      const textResponse = await response.text();
      
      let data;
      try {
        data = JSON.parse(textResponse);
      } catch (e) {
        // Se falhar o parse, provavelmente é um erro HTML do Vercel (500 Server Error)
        console.error("Erro ao fazer parse do JSON:", e);
        data = { 
          message: 'Erro Crítico no Servidor (Não-JSON)', 
          details: 'O servidor retornou uma resposta inválida (provavelmente HTML de erro).',
          rawResponse: textResponse.substring(0, 500) // Mostra o começo do erro HTML
        };
      }
      
      if (response.ok) {
        setStatus('success');
      } else {
        setStatus('error');
      }
      setResult(data);
    } catch (error: any) {
      setStatus('error');
      setResult({ message: 'Erro de Rede / Fetch', details: error.message });
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto py-12">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-heading font-bold text-slate-800 flex items-center justify-center gap-3">
            <Database className="text-blue-600" />
            Teste de Conexão DB
          </h1>
          <p className="text-slate-500 mt-2">
            Diagnóstico de conexão entre Vercel e Supabase.
          </p>
        </header>

        <Card className="text-center p-8 shadow-lg">
          {status === 'idle' && (
            <div className="py-8">
              <p className="text-slate-600 mb-6">Clique no botão abaixo para testar a API.</p>
              <Button onClick={runTest} size="lg">
                Iniciar Diagnóstico
              </Button>
            </div>
          )}

          {status === 'loading' && (
            <div className="py-12 flex flex-col items-center">
              <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
              <p className="text-slate-500 font-medium">Verificando variáveis e conexão...</p>
            </div>
          )}

          {status === 'success' && (
            <div className="py-6 animate-fade-in-down">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={32} />
              </div>
              <h2 className="text-xl font-bold text-slate-800 mb-2">Conexão Estabelecida!</h2>
              <p className="text-slate-600 mb-6">O Backend conseguiu ler o Supabase corretamente.</p>
              
              <div className="bg-slate-50 p-4 rounded-lg text-left text-xs font-mono border border-slate-200 overflow-auto mb-6 max-h-96">
                <pre>{JSON.stringify(result, null, 2)}</pre>
              </div>

              <Button onClick={runTest} variant="secondary">Testar Novamente</Button>
            </div>
          )}

          {status === 'error' && (
            <div className="py-6 animate-fade-in-down">
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle size={32} />
              </div>
              <h2 className="text-xl font-bold text-slate-800 mb-2">Falha na Conexão</h2>
              <p className="text-slate-600 mb-6">Ocorreu um erro ao tentar conectar.</p>
              
              <div className="bg-red-50 p-4 rounded-lg text-left text-xs font-mono border border-red-200 text-red-800 overflow-auto mb-6 max-h-96 whitespace-pre-wrap">
                <div className="font-bold mb-2 text-red-900 border-b border-red-200 pb-1">Diagnóstico do Erro:</div>
                {JSON.stringify(result, null, 2)}
              </div>

              <div className="text-left text-sm text-slate-600 mb-6 space-y-3 bg-slate-50 p-4 rounded border border-slate-200">
                <p className="font-bold flex items-center gap-2"><ServerCrash size={16}/> Ações Recomendadas:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Se aparecer <code>rawResponse</code> com HTML, é erro do servidor Vercel.</li>
                  <li>Se <code>debug.hasUrl</code> for <strong>false</strong>, vá no painel do Vercel → Settings → Environment Variables.</li>
                  <li>Adicione <code>VITE_SUPABASE_URL</code> e <code>SUPABASE_SERVICE_ROLE_KEY</code> lá.</li>
                  <li>Redeploy o projeto após adicionar as variáveis.</li>
                </ul>
              </div>

              <Button onClick={runTest} variant="secondary">Tentar Novamente</Button>
            </div>
          )}
        </Card>
      </div>
    </Layout>
  );
};

export default TestDb;
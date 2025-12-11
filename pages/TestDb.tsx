import React, { useState } from 'react';
import Layout from '../components/Layout';
import Button from '../components/Button';
import Card from '../components/Card';
import { Database, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';

const TestDb: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [result, setResult] = useState<any>(null);

  const runTest = async () => {
    setStatus('loading');
    setResult(null);
    try {
      const response = await fetch('/api/test-db');
      const data = await response.json();
      
      if (response.ok) {
        setStatus('success');
      } else {
        setStatus('error');
      }
      setResult(data);
    } catch (error: any) {
      setStatus('error');
      setResult({ message: 'Erro ao contatar API', details: error.message });
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
            Verifica se a API (Backend) consegue ler o Supabase (Banco de Dados).
          </p>
        </header>

        <Card className="text-center p-8">
          {status === 'idle' && (
            <div className="py-8">
              <p className="text-slate-600 mb-6">Clique no botão abaixo para testar a conexão.</p>
              <Button onClick={runTest} size="lg">
                Iniciar Teste
              </Button>
            </div>
          )}

          {status === 'loading' && (
            <div className="py-12 flex flex-col items-center">
              <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
              <p className="text-slate-500 font-medium">Testando conexão...</p>
            </div>
          )}

          {status === 'success' && (
            <div className="py-6 animate-fade-in-down">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={32} />
              </div>
              <h2 className="text-xl font-bold text-slate-800 mb-2">Sucesso!</h2>
              <p className="text-slate-600 mb-6">{result?.message}</p>
              
              <div className="bg-slate-50 p-4 rounded-lg text-left text-sm font-mono border border-slate-200 overflow-auto mb-6">
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
              <p className="text-slate-600 mb-6">Ocorreu um erro ao tentar conectar ao banco.</p>
              
              <div className="bg-red-50 p-4 rounded-lg text-left text-sm font-mono border border-red-200 text-red-800 overflow-auto mb-6">
                <pre>{JSON.stringify(result, null, 2)}</pre>
              </div>

              <div className="text-left text-sm text-slate-500 mb-6 space-y-2">
                <p className="font-bold">Dicas de resolução:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Verifique se o arquivo <code>.env.local</code> tem as chaves corretas.</li>
                  <li>Verifique se você rodou o script SQL (Parte 4) no Supabase.</li>
                  <li>Se estiver no Vercel, verifique as Environment Variables no painel.</li>
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
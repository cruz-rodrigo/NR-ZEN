import React, { useState } from 'react';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Button from '../components/Button';
import { ClipboardList, QrCode, Copy, ExternalLink, RefreshCw, CheckCircle2 } from 'lucide-react';
import { APP_URL } from '../constants';
import { useNavigate } from 'react-router-dom';

const Surveys: React.FC = () => {
  const navigate = useNavigate();
  const [copiedId, setCopiedId] = useState<number | null>(null);

  // Exemplo estático para demonstração visual
  const activeLinks = [
    { id: 1, company: "Indústrias Metalúrgicas Beta", sector: "Operação Logística – Turno 1", code: "beta-log-01", expires: "30 dias", responses: 0 },
  ];

  const handleCopy = (id: number, code: string) => {
    navigator.clipboard.writeText(`${APP_URL}/#/questionario/${code}`);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <Layout>
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-heading font-bold text-slate-800">Questionários</h1>
          <p className="text-slate-500 mt-1">Gerencie os links de coleta ativos.</p>
        </div>
        <Button onClick={() => navigate('/app/onboarding')}>+ Novo Link</Button>
      </header>

      <div className="grid grid-cols-1 gap-6">
        {activeLinks.map((link) => (
          <Card key={link.id} className="flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4 w-full md:w-auto">
              <div className="bg-blue-100 p-3 rounded-xl text-blue-600 shrink-0">
                <ClipboardList size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-lg">{link.sector}</h3>
                <p className="text-slate-500 text-sm flex items-center gap-2">
                  <span className="font-medium text-slate-700">{link.company}</span>
                  <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                  Vence em {link.expires}
                </p>
                <div className="mt-2 flex items-center gap-2 text-sm">
                  <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-bold text-xs border border-emerald-100">Coleta Ativa</span>
                  <span className="text-slate-400">• {link.responses} respostas recebidas</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto items-end sm:items-center">
               <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded border border-slate-200 text-slate-500 text-xs font-mono truncate max-w-[200px]">
                 {APP_URL}/#/questionario/{link.code}
               </div>
               
               <div className="flex items-center gap-2">
                 {copiedId === link.id && (
                    <span className="text-xs font-bold text-emerald-600 animate-fade-in-down">Copiado!</span>
                 )}
                 <div className="flex gap-2">
                   <Button 
                      variant={copiedId === link.id ? "secondary" : "secondary"} 
                      size="sm" 
                      onClick={() => handleCopy(link.id, link.code)} 
                      title="Copiar Link"
                      className={copiedId === link.id ? "text-emerald-600 border-emerald-200 bg-emerald-50" : ""}
                   >
                     {copiedId === link.id ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                   </Button>
                   <Button variant="secondary" size="sm" title="Gerar QR Code">
                     <QrCode size={16} />
                   </Button>
                   <Button variant="secondary" size="sm" title="Testar Link" onClick={() => window.open(`/#/questionario/${link.code}`, '_blank')}>
                     <ExternalLink size={16} />
                   </Button>
                 </div>
               </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-8 text-center text-slate-400 text-sm">
         <p>Os links são gerados automaticamente ao cadastrar novos setores.</p>
      </div>
    </Layout>
  );
};

export default Surveys;
import React from 'react';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Button from '../components/Button';
import { ClipboardList, QrCode, Copy, ExternalLink, RefreshCw } from 'lucide-react';
import { APP_URL } from '../constants';

const Surveys: React.FC = () => {
  // Mock Active Links
  const activeLinks = [
    { id: 1, company: "Indústrias Metalúrgicas Beta", sector: "Operação Logística – Turno 1", code: "beta-log-01", expires: "20/11/2025", responses: 32 },
    { id: 2, company: "Indústrias Metalúrgicas Beta", sector: "Administrativo", code: "beta-adm-02", expires: "20/11/2025", responses: 12 },
    { id: 3, company: "Transportadora Veloz", sector: "Motoristas Frota Pesada", code: "veloz-mot-05", expires: "15/11/2025", responses: 8 },
  ];

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(`${APP_URL}/#/questionario/${code}`);
    alert('Link copiado!');
  };

  return (
    <Layout>
      <header className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-slate-800">Questionários</h1>
        <p className="text-slate-500 mt-1">Gerencie os links de coleta ativos.</p>
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
                  Expira em {link.expires}
                </p>
                <div className="mt-2 flex items-center gap-2 text-sm">
                  <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-bold text-xs border border-emerald-100">Coleta Ativa</span>
                  <span className="text-slate-400">• {link.responses} respostas recebidas</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
               <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded border border-slate-200 text-slate-500 text-xs font-mono truncate max-w-[200px]">
                 {APP_URL}/#/questionario/{link.code}
               </div>
               <div className="flex gap-2">
                 <Button variant="secondary" size="sm" onClick={() => handleCopy(link.code)} title="Copiar Link">
                   <Copy size={16} />
                 </Button>
                 <Button variant="secondary" size="sm" title="Gerar QR Code">
                   <QrCode size={16} />
                 </Button>
                 <Button variant="secondary" size="sm" title="Testar Link">
                   <ExternalLink size={16} />
                 </Button>
               </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-8 text-center">
        <Button variant="ghost" className="text-slate-400 hover:text-slate-600">
          <RefreshCw size={16} className="mr-2"/> Carregar links expirados
        </Button>
      </div>
    </Layout>
  );
};

export default Surveys;
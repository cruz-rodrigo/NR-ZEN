import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Button from '../components/Button';
import { ChevronRight, Copy, Plus, FileText, Calendar, Users, History, CheckCircle2 } from 'lucide-react';
import { ActionPlanItem } from '../types';
import { APP_URL } from '../constants';

const SectorDetail: React.FC = () => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    const link = `${window.location.origin}/#/questionario`;
    navigator.clipboard.writeText(link).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const openReport = () => {
    navigate('/relatorio');
  };

  const actionPlan: ActionPlanItem[] = [
    { domain: "Demandas", risk: "Prazos irreais", action: "Rever dimensionamento da equipe", responsible: "Gestão Operacional", deadline: "30/11/2025", status: "Em andamento" },
    { domain: "Apoio", risk: "Falta de suporte líder", action: "Treinamento de feedback para líderes", responsible: "RH", deadline: "15/12/2025", status: "Pendente" },
  ];

  // Cálculo do Gráfico de Rosca
  const score = 58;
  const radius = 70;
  const circumference = 2 * Math.PI * radius; // ~440
  const offset = circumference - (score / 100) * circumference;

  return (
    <Layout>
      {/* Breadcrumb */}
      <nav className="flex items-center text-sm text-slate-500 mb-6">
        <Link to="/app" className="hover:text-blue-600 transition-colors">Empresas</Link>
        <ChevronRight size={14} className="mx-2 text-slate-400" />
        <span className="hover:text-slate-800 cursor-pointer">Indústrias Metalúrgicas Beta</span>
        <ChevronRight size={14} className="mx-2 text-slate-400" />
        <span className="text-slate-900 font-semibold bg-blue-50 px-2 py-0.5 rounded">Operação Logística – Turno 1</span>
      </nav>

      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-heading font-bold text-slate-800">Operação Logística – Turno 1</h1>
          <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
            <span className="flex items-center gap-1.5"><Users size={14}/> 45 Colaboradores (Est.)</span>
            <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
            <span className="flex items-center gap-1.5"><Calendar size={14}/> Última coleta: 10/10/2025</span>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={openReport}>
            <FileText size={18} className="mr-2" />
            Visualizar Relatório
          </Button>
          <Button onClick={() => alert("Simulação: Modal de agendamento aberto.")}>
            Agendar Coleta
          </Button>
        </div>
      </header>

      {/* Overview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* Score Card */}
        <Card className="flex flex-col justify-center items-center text-center relative overflow-hidden border-t-4 border-t-amber-500">
          <div className="absolute top-0 right-0 p-3 opacity-10">
            <History size={60} />
          </div>
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-6">Nível de Risco Global</h3>
          
          <div className="relative w-48 h-48 mb-4 flex items-center justify-center">
            {/* SVG Gauge Chart */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 180 180">
              {/* Background Circle */}
              <circle 
                cx="90" 
                cy="90" 
                r={radius} 
                stroke="#F1F5F9" 
                strokeWidth="14" 
                fill="none" 
              />
              {/* Progress Circle */}
              <circle 
                cx="90" 
                cy="90" 
                r={radius} 
                stroke="#F59E0B" 
                strokeWidth="14" 
                fill="none" 
                strokeDasharray={circumference} 
                strokeDashoffset={offset} 
                strokeLinecap="round" 
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-bold text-slate-800 tracking-tight">{score}</span>
              <span className="text-xs text-slate-400 font-medium uppercase mt-1">/ 100 Pontos</span>
            </div>
          </div>
          
          <div className="inline-flex items-center px-4 py-1.5 bg-amber-50 text-amber-700 rounded-full text-sm font-bold mb-2 border border-amber-200">
            MODERADO
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 w-full flex justify-between text-xs font-medium text-slate-500">
             <div className="flex flex-col items-center w-1/2 border-r border-slate-100">
               <span className="block text-xl font-bold text-slate-800">32</span>
               <span>Respondentes</span>
             </div>
             <div className="flex flex-col items-center w-1/2">
               <span className="block text-xl font-bold text-slate-800">71%</span>
               <span>Adesão</span>
             </div>
          </div>
        </Card>

        {/* Breakdown Chart */}
        <Card className="lg:col-span-2 flex flex-col">
           <div className="flex justify-between items-center mb-6">
             <h3 className="font-bold text-slate-800 text-lg">Percepção por Domínio (Fatores)</h3>
             <select className="text-sm border-none bg-slate-50 rounded px-2 py-1 text-slate-600 focus:ring-0 cursor-pointer">
               <option>Out/2025</option>
             </select>
           </div>
           
           <div className="space-y-5 flex-1 justify-center flex flex-col">
             {[
               { name: "Demandas e Ritmo", val: 45, color: "bg-amber-500", text: "text-amber-600" },
               { name: "Autonomia e Controle", val: 72, color: "bg-emerald-500", text: "text-emerald-600" },
               { name: "Apoio Social (Liderança)", val: 38, color: "bg-red-500", text: "text-red-600" },
               { name: "Relações Interpessoais", val: 65, color: "bg-amber-500", text: "text-amber-600" },
             ].map((d) => (
               <div key={d.name}>
                 <div className="flex justify-between text-sm mb-1.5">
                   <span className="font-medium text-slate-700">{d.name}</span>
                   <span className={`font-bold ${d.text}`}>{d.val}</span>
                 </div>
                 <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                   <div className={`h-full rounded-full ${d.color} transition-all duration-1000 ease-out`} style={{ width: `${d.val}%` }}></div>
                 </div>
               </div>
             ))}
           </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Collection Links */}
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-slate-800">Links de Coleta Ativos</h3>
            <Button size="sm" variant="ghost" onClick={() => alert("Gerado novo link.")}>+ Novo Link</Button>
          </div>
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase">Link Público</span>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded font-bold">Ativo</span>
            </div>
            <div className="flex gap-2">
              <input readOnly value={`${APP_URL}/#/questionario/beta-log`} className="flex-1 text-sm bg-white border border-slate-300 rounded px-3 py-2 text-slate-600" />
              <Button 
                onClick={handleCopyLink} 
                size="sm" 
                variant={copied ? "secondary" : "secondary"}
                className={`px-3 ${copied ? "text-emerald-600 bg-emerald-50 border-emerald-200" : ""}`}
              >
                {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
              </Button>
            </div>
            <div className="mt-2 flex justify-between items-center h-4">
              <p className="text-xs text-slate-400">Criado em 01/10/2025. Vence em 30 dias.</p>
              {copied && (
                <p className="text-xs text-emerald-600 font-bold flex items-center animate-fade-in-down">
                  <CheckCircle2 size={12} className="mr-1"/> Link copiado!
                </p>
              )}
            </div>
          </div>
        </Card>

        {/* History */}
        <Card>
           <h3 className="font-bold text-slate-800 mb-4">Histórico Evolutivo</h3>
           <div className="space-y-3">
             <div className="flex items-center justify-between p-4 bg-white border border-blue-100 shadow-sm rounded-lg relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>
                <div>
                  <p className="font-bold text-sm text-slate-800">Outubro 2025</p>
                  <p className="text-xs text-slate-500">Nível: Moderado</p>
                </div>
                <div className="text-emerald-600 text-sm font-bold flex items-center bg-emerald-50 px-2 py-1 rounded">
                   ▲ +4 pts
                </div>
             </div>
             <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-lg opacity-70">
                <div>
                  <p className="font-bold text-slate-700">Abril 2025</p>
                  <p className="text-xs text-slate-500">Nível: Moderado</p>
                </div>
                <div className="text-xs font-bold text-slate-400 uppercase">
                  Base
                </div>
             </div>
           </div>
        </Card>
      </div>

      {/* Action Plan */}
      <Card>
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-slate-800 text-lg">Plano de Ação</h3>
          <Button size="sm"><Plus size={16} className="mr-1"/> Nova Ação</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 font-semibold text-slate-500">Domínio</th>
                <th className="px-4 py-3 font-semibold text-slate-500">Fator de Risco</th>
                <th className="px-4 py-3 font-semibold text-slate-500">Ação Mitigadora</th>
                <th className="px-4 py-3 font-semibold text-slate-500">Responsável</th>
                <th className="px-4 py-3 font-semibold text-slate-500">Prazo</th>
                <th className="px-4 py-3 font-semibold text-slate-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {actionPlan.map((item, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-slate-700">{item.domain}</td>
                  <td className="px-4 py-3 text-red-600 font-medium bg-red-50/50 rounded-lg">{item.risk}</td>
                  <td className="px-4 py-3 text-slate-600">{item.action}</td>
                  <td className="px-4 py-3 text-slate-600">{item.responsible}</td>
                  <td className="px-4 py-3 text-slate-600">{item.deadline}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold border ${
                      item.status === 'Concluído' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                      item.status === 'Em andamento' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </Layout>
  );
};

export default SectorDetail;
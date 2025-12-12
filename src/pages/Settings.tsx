import React, { useState } from 'react';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Button from '../components/Button';
import { User, Lock, Bell, Palette, Upload } from 'lucide-react';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <Layout>
      <header className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-slate-800">Configurações</h1>
        <p className="text-slate-500 mt-1">Gerencie seu perfil e preferências da plataforma.</p>
      </header>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-64 shrink-0">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
             {[
               { id: 'profile', icon: User, label: 'Meu Perfil' },
               { id: 'branding', icon: Palette, label: 'Personalização' },
               { id: 'security', icon: Lock, label: 'Segurança' },
               { id: 'notifications', icon: Bell, label: 'Notificações' },
             ].map((item) => (
               <button
                 key={item.id}
                 onClick={() => setActiveTab(item.id)}
                 className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors border-l-4 ${
                   activeTab === item.id 
                     ? 'bg-blue-50 text-blue-700 border-blue-600' 
                     : 'text-slate-600 hover:bg-slate-50 border-transparent'
                 }`}
               >
                 <item.icon size={18} />
                 {item.label}
               </button>
             ))}
          </div>
        </div>

        <div className="flex-1">
          {activeTab === 'profile' && (
            <Card className="space-y-6">
               <div>
                 <h2 className="text-lg font-bold text-slate-800 mb-4">Dados Pessoais</h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div>
                     <label className="block text-sm font-medium text-slate-700 mb-1">Nome Completo</label>
                     <input type="text" defaultValue="João Silva" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-700"/>
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-slate-700 mb-1">E-mail</label>
                     <input type="email" defaultValue="joao.silva@consultoria.com" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-700"/>
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-slate-700 mb-1">Cargo / Função</label>
                     <input type="text" defaultValue="Engenheiro de Segurança" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-700"/>
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-slate-700 mb-1">Registro Profissional (CREA/MTE)</label>
                     <input type="text" defaultValue="123456/SP" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-700"/>
                   </div>
                 </div>
               </div>
               <div className="pt-4 border-t border-slate-100 flex justify-end">
                 <Button>Salvar Alterações</Button>
               </div>
            </Card>
          )}

          {activeTab === 'branding' && (
            <Card className="space-y-6">
               <div>
                 <h2 className="text-lg font-bold text-slate-800 mb-2">White-Label (Sua Marca)</h2>
                 <p className="text-sm text-slate-500 mb-6">Personalize os relatórios PDF com o logotipo da sua consultoria.</p>
                 
                 <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:bg-slate-50 transition-colors cursor-pointer">
                    <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Upload size={24} />
                    </div>
                    <p className="font-medium text-slate-700">Clique para fazer upload do logo</p>
                    <p className="text-xs text-slate-400 mt-1">PNG ou JPG (Max. 2MB)</p>
                 </div>
               </div>
               
               <div>
                  <label className="flex items-center gap-3">
                    <input type="checkbox" className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500" defaultChecked />
                    <span className="text-sm text-slate-700">Exibir minha marca no cabeçalho dos relatórios</span>
                  </label>
               </div>

               <div className="pt-4 border-t border-slate-100 flex justify-end">
                 <Button>Salvar Preferências</Button>
               </div>
            </Card>
          )}

           {activeTab === 'security' && (
            <Card className="text-center py-12">
               <Lock size={48} className="mx-auto text-slate-300 mb-4" />
               <p className="text-slate-500">Configurações de senha e 2FA disponíveis em breve.</p>
            </Card>
          )}

          {activeTab === 'notifications' && (
            <Card className="text-center py-12">
               <Bell size={48} className="mx-auto text-slate-300 mb-4" />
               <p className="text-slate-500">Configurações de alerta por e-mail disponíveis em breve.</p>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
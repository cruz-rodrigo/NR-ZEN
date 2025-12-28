
import React, { useState } from 'react';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Button from '../components/Button';
import { User, Lock, Bell, Palette, Upload, Mail, AlertCircle, CheckCircle2, ShieldCheck, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Settings: React.FC = () => {
  const { user, apiCall, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isChangingEmail, setIsChangingEmail] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const [emailForm, setEmailForm] = useState({ newEmail: '', confirmNewEmail: '', password: '' });

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (emailForm.newEmail !== emailForm.confirmNewEmail) {
      setMessage({ type: 'error', text: 'Os novos e-mails não conferem.' });
      return;
    }

    setLoading(true);
    try {
      await apiCall('/api/auth?action=update-email', {
        method: 'PUT',
        body: JSON.stringify(emailForm)
      });
      setMessage({ type: 'success', text: 'E-mail atualizado com sucesso!' });
      setIsChangingEmail(false);
      setEmailForm({ newEmail: '', confirmNewEmail: '', password: '' });
      await refreshUser();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Falha ao atualizar e-mail.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <header className="mb-8">
        <h1 className="text-3xl font-heading font-black text-slate-800 tracking-tight">Configurações</h1>
        <p className="text-slate-500 mt-1 font-medium italic">Gerencie seu perfil e preferências da consultoria.</p>
      </header>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-64 shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
             {[
               { id: 'profile', icon: User, label: 'Meu Perfil' },
               { id: 'branding', icon: Palette, label: 'Personalização' },
               { id: 'security', icon: Lock, label: 'Segurança' },
               { id: 'notifications', icon: Bell, label: 'Notificações' },
             ].map((item) => (
               <button
                 key={item.id}
                 onClick={() => { setActiveTab(item.id); setMessage(null); }}
                 className={`w-full flex items-center gap-3 px-6 py-4 text-[11px] font-black uppercase tracking-widest transition-all border-l-4 ${
                   activeTab === item.id 
                     ? 'bg-blue-50 text-blue-700 border-blue-600' 
                     : 'text-slate-400 hover:bg-slate-50 border-transparent hover:text-slate-600'
                 }`}
               >
                 <item.icon size={18} strokeWidth={2.5} />
                 {item.label}
               </button>
             ))}
          </div>
        </div>

        <div className="flex-1">
          {message && (
            <div className={`mb-6 p-4 rounded-xl border flex items-center gap-3 animate-fade-in-down ${
              message.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-red-50 border-red-200 text-red-700'
            }`}>
              {message.type === 'success' ? <CheckCircle2 size={18}/> : <AlertCircle size={18}/>}
              <p className="text-sm font-bold">{message.text}</p>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="space-y-6 animate-fade-in">
              <Card className="space-y-6">
                 <div>
                   <h2 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2 uppercase tracking-tight">
                     <User size={20} className="text-blue-600" /> Identidade Profissional
                   </h2>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="md:col-span-2">
                        <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4">
                           <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-slate-400 border border-slate-100">
                                <Mail size={24} />
                              </div>
                              <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">E-mail de Acesso</p>
                                <p className="text-sm font-bold text-slate-700">{user?.email}</p>
                              </div>
                           </div>
                           <Button size="sm" variant="secondary" onClick={() => setIsChangingEmail(!isChangingEmail)}>
                             Alterar E-mail
                           </Button>
                        </div>

                        {isChangingEmail && (
                          <div className="mt-4 p-6 bg-blue-50/50 border border-blue-100 rounded-2xl animate-fade-in">
                            <form onSubmit={handleUpdateEmail} className="space-y-4">
                               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-[10px] font-black text-blue-900 uppercase tracking-widest mb-1.5">Novo E-mail</label>
                                    <input required type="email" className="w-full px-4 py-2.5 bg-white border border-blue-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-600 text-sm font-medium" 
                                      value={emailForm.newEmail} onChange={e => setEmailForm({...emailForm, newEmail: e.target.value})}
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[10px] font-black text-blue-900 uppercase tracking-widest mb-1.5">Confirme o Novo E-mail</label>
                                    <input required type="email" className="w-full px-4 py-2.5 bg-white border border-blue-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-600 text-sm font-medium" 
                                      value={emailForm.confirmNewEmail} onChange={e => setEmailForm({...emailForm, confirmNewEmail: e.target.value})}
                                    />
                                  </div>
                               </div>
                               <div className="pt-2">
                                  <label className="block text-[10px] font-black text-blue-900 uppercase tracking-widest mb-1.5">Sua Senha Atual (Segurança)</label>
                                  <input required type="password" className="w-full px-4 py-2.5 bg-white border border-blue-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                                    value={emailForm.password} onChange={e => setEmailForm({...emailForm, password: e.target.value})}
                                  />
                               </div>
                               <div className="flex gap-2 justify-end pt-2">
                                  <Button type="button" variant="ghost" size="sm" onClick={() => setIsChangingEmail(false)}>Cancelar</Button>
                                  <Button type="submit" size="sm" disabled={loading}>{loading ? <Loader2 className="animate-spin" size={16}/> : 'Confirmar Alteração'}</Button>
                               </div>
                            </form>
                          </div>
                        )}
                     </div>

                     <div>
                       <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Nome Completo / Consultoria</label>
                       <input type="text" defaultValue={user?.name} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none text-sm font-bold text-slate-700 transition-all"/>
                     </div>
                     <div>
                       <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Cargo / Especialidade</label>
                       <input type="text" placeholder="Ex: Eng. de Segurança" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none text-sm font-bold text-slate-700 transition-all"/>
                     </div>
                     <div>
                       <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Registro Profissional (CREA/MTE)</label>
                       <input type="text" placeholder="Ex: 123456/SP" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none text-sm font-bold text-slate-700 transition-all"/>
                     </div>
                   </div>
                 </div>
                 <div className="pt-6 border-t border-slate-50 flex justify-end">
                   <Button className="h-14 px-10">Salvar Alterações</Button>
                 </div>
              </Card>

              <div className="bg-amber-50 border border-amber-100 p-6 rounded-3xl flex gap-5 items-start">
                 <div className="p-3 bg-white rounded-2xl shadow-sm text-amber-500 shrink-0">
                    <ShieldCheck size={24} />
                 </div>
                 <div>
                    <h4 className="text-amber-900 font-black uppercase text-xs tracking-widest mb-1">Proteção de Dados (LGPD)</h4>
                    <p className="text-amber-800/70 text-sm font-medium leading-relaxed italic">
                      Seus dados são criptografados e utilizados exclusivamente para assinar seus relatórios técnicos. A NR ZEN não compartilha suas informações profissionais com terceiros.
                    </p>
                 </div>
              </div>
            </div>
          )}

          {activeTab === 'branding' && (
            <Card className="space-y-6 animate-fade-in">
               <div>
                 <h2 className="text-lg font-black text-slate-800 mb-2 uppercase tracking-tight">Personalização White-Label</h2>
                 <p className="text-sm text-slate-500 mb-8 font-medium">Aplique a identidade da sua consultoria nos laudos automatizados.</p>
                 
                 <div className="border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center hover:bg-slate-50 transition-colors cursor-pointer group">
                    <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <Upload size={32} />
                    </div>
                    <p className="font-black text-slate-700 uppercase text-xs tracking-widest">Carregar Logotipo</p>
                    <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-tighter">PNG transparente recomendado (Max. 2MB)</p>
                 </div>
               </div>
               
               <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <label className="flex items-center gap-4 cursor-pointer group">
                    <input type="checkbox" className="w-5 h-5 text-blue-600 rounded-lg border-slate-300 focus:ring-blue-600" defaultChecked />
                    <div>
                       <span className="text-sm font-black text-slate-700 uppercase tracking-tight">Exibir minha marca nos cabeçalhos</span>
                       <p className="text-xs text-slate-500 font-medium mt-0.5">Se desativado, apenas o logotipo padrão NR ZEN será exibido.</p>
                    </div>
                  </label>
               </div>

               <div className="pt-6 border-t border-slate-50 flex justify-end">
                 <Button className="h-14 px-10">Aplicar Personalização</Button>
               </div>
            </Card>
          )}

           {activeTab === 'security' && (
            <Card className="text-center py-20 animate-fade-in">
               <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-300">
                 <Lock size={48} />
               </div>
               <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">Segurança de Acesso</h3>
               <p className="text-slate-500 max-w-xs mx-auto mt-2 text-sm font-medium">Troca de senha e autenticação em duas etapas (2FA) em fase de homologação.</p>
            </Card>
          )}

          {activeTab === 'notifications' && (
            <Card className="text-center py-20 animate-fade-in">
               <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-300">
                 <Bell size={48} />
               </div>
               <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">Centro de Alertas</h3>
               <p className="text-slate-500 max-w-xs mx-auto mt-2 text-sm font-medium">Configure avisos de vencimento de coletas e novos respondentes por e-mail ou WhatsApp.</p>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Settings;


import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Building2, FileText, Settings, LogOut, ClipboardList, CreditCard, UserCircle, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Logo: React.FC<{ className?: string, light?: boolean, size?: 'sm' | 'md' | 'lg' }> = ({ 
  className = "", 
  light = false,
  size = 'md' 
}) => {
  const iconSize = size === 'sm' ? 28 : size === 'lg' ? 56 : 38;
  const textSize = size === 'sm' ? 'text-xl' : size === 'lg' ? 'text-[48px]' : 'text-3xl';
  
  const nrColor = light ? "text-white" : "text-slate-900"; 
  const zenColor = light ? "text-blue-300" : "text-blue-600";
  const iconColor = light ? "#93C5FD" : "#2563EB";

  return (
    <div className={`flex items-center gap-5 select-none ${className}`}>
      <div className="relative flex items-center justify-center">
        <svg width={iconSize} height={iconSize} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 drop-shadow-md">
          <circle cx="16" cy="16" r="15" stroke={iconColor} strokeWidth="3" />
          <path d="M9.5 16L13.5 20L23 10.5" stroke={iconColor} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div className={`font-heading tracking-[-0.05em] leading-none ${textSize}`}>
        <span className={`font-black ${nrColor}`}>NR</span>
        <span className={`font-light ml-1 ${zenColor}`}>ZEN</span>
      </div>
    </div>
  );
};

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const { logout, user } = useAuth();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/app' },
    { icon: Building2, label: 'Empresas', path: '/app/companies' },
    { icon: ClipboardList, label: 'Coletas', path: '/app/surveys' },
    { icon: FileText, label: 'Relatórios', path: '/app/reports' },
    { icon: CreditCard, label: 'Faturamento', path: '/app/billing' },
    { icon: Settings, label: 'Ajustes', path: '/app/settings' },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-row font-sans overflow-x-hidden">
      {/* Sidebar - Nova Proporção Ultra-Premium 360px */}
      <aside className="w-[360px] bg-white border-r border-slate-100 flex flex-col fixed h-full z-50 hidden lg:flex shadow-[50px_0_100px_rgba(15,23,42,0.04)]">
        
        {/* Header da Sidebar - Mais área de respiro para o Logo */}
        <div className="h-48 flex items-center justify-center border-b border-slate-50 px-12">
          <Link to="/" className="group hover:scale-105 transition-transform duration-500">
            <Logo size="lg" />
          </Link>
        </div>

        {/* Navegação - Proporção Bold e Ícones Grandes */}
        <nav className="flex-1 overflow-y-auto py-14 px-10 space-y-5">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/app' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.label}
                to={item.path}
                className={`flex items-center justify-between gap-6 px-10 py-6.5 rounded-[26px] text-[14px] font-heading font-black uppercase tracking-[0.2em] transition-all duration-300 group ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-[0_25px_50px_-12px_rgba(37,99,235,0.4)] translate-x-3 scale-[1.02]' 
                    : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-6">
                  <item.icon size={26} strokeWidth={isActive ? 2.5 : 2} className={`${isActive ? 'text-white' : 'text-slate-300 group-hover:text-blue-500'} transition-colors duration-300`} />
                  {item.label}
                </div>
                {isActive && <ChevronRight size={18} className="opacity-40 animate-in slide-in-from-left-2" />}
              </Link>
            );
          })}
        </nav>

        {/* Footer da Sidebar / Perfil Escalado */}
        <div className="p-10 border-t border-slate-50 space-y-8">
          <div className="bg-slate-50 rounded-[32px] p-7 flex items-center gap-6 border border-slate-100 group cursor-pointer hover:bg-white hover:shadow-2xl hover:border-blue-100 transition-all duration-300">
             <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-xl font-black shadow-xl shadow-blue-200 group-hover:scale-110 transition-transform">
               {user?.name?.substring(0,2).toUpperCase() || 'US'}
             </div>
             <div className="truncate flex-1">
               <p className="text-base font-black text-slate-900 truncate tracking-tight uppercase">{user?.name?.split(' ')[0]}</p>
               <p className="text-[11px] text-blue-600 font-black uppercase tracking-[0.15em] mt-1 opacity-70">
                 {user?.plan_tier === 'business' ? 'Business Pro' : 'Consultor Premium'}
               </p>
             </div>
          </div>
          
          <button 
            onClick={logout} 
            className="flex items-center justify-center gap-4 w-full px-10 py-6 text-[12px] font-black uppercase tracking-[0.25em] text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-[24px] transition-all group"
          >
            <LogOut size={22} className="group-hover:translate-x-[-4px] transition-transform" />
            Sair da Plataforma
          </button>
        </div>
      </aside>

      {/* Main Content - Margem compensada para Sidebar 360px */}
      <main className="flex-1 lg:ml-[360px] p-10 lg:p-20 min-h-screen">
        <div className="max-w-[1400px] mx-auto animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;

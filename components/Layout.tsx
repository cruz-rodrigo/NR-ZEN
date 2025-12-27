
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Building2, FileText, Settings, LogOut, ClipboardList, CreditCard, UserCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Logo: React.FC<{ className?: string, light?: boolean, size?: 'sm' | 'md' | 'lg' }> = ({ 
  className = "", 
  light = false,
  size = 'md' 
}) => {
  const iconSize = size === 'sm' ? 24 : size === 'lg' ? 48 : 34;
  const textSize = size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-[42px]' : 'text-2xl';
  
  const nrColor = light ? "text-white" : "text-slate-900"; 
  const zenColor = light ? "text-blue-300" : "text-blue-600";
  const iconColor = light ? "#93C5FD" : "#2563EB";

  return (
    <div className={`flex items-center gap-4 select-none ${className}`}>
      <div className="relative flex items-center justify-center">
        <svg width={iconSize} height={iconSize} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 drop-shadow-sm">
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
    { icon: Settings, label: 'Configurações', path: '/app/settings' },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-row font-sans overflow-x-hidden">
      {/* Sidebar Redesenhada - Proporção Bold */}
      <aside className="w-[340px] bg-white border-r border-slate-100 flex flex-col fixed h-full z-50 hidden lg:flex shadow-[30px_0_60px_rgba(15,23,42,0.02)]">
        
        {/* Logo Section - Maior respiro */}
        <div className="h-40 flex items-center justify-center border-b border-slate-50 px-10">
          <Link to="/" className="group hover:scale-105 transition-transform duration-500">
            <Logo size="lg" />
          </Link>
        </div>

        {/* Navegação - Estilo Landing Page (Bold/Caps) */}
        <nav className="flex-1 overflow-y-auto py-12 px-8 space-y-4">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/app' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.label}
                to={item.path}
                className={`flex items-center gap-5 px-8 py-5 rounded-[24px] text-xs font-heading font-black uppercase tracking-[0.15em] transition-all duration-300 group ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-[0_20px_40px_-10px_rgba(37,99,235,0.3)] translate-x-2' 
                    : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <item.icon size={22} className={`${isActive ? 'text-white' : 'text-slate-300 group-hover:text-blue-500'} transition-colors duration-300`} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Perfil e Logout Section */}
        <div className="p-8 border-t border-slate-50 space-y-6">
          <div className="bg-slate-50 rounded-[28px] p-6 flex items-center gap-5 border border-slate-100">
             <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-lg font-black shadow-lg shadow-blue-200">
               {user?.name?.substring(0,2).toUpperCase() || 'US'}
             </div>
             <div className="truncate">
               <p className="text-sm font-black text-slate-900 truncate tracking-tight uppercase">{user?.name?.split(' ')[0]}</p>
               <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest mt-0.5 opacity-70">
                 {user?.plan_tier === 'business' ? 'Business Pro' : 'Acesso Total'}
               </p>
             </div>
          </div>
          
          <button 
            onClick={logout} 
            className="flex items-center justify-center gap-3 w-full px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-[22px] transition-all group"
          >
            <LogOut size={18} className="group-hover:translate-x-1 transition-transform" />
            Sair do Sistema
          </button>
        </div>
      </aside>

      {/* Main Content - Ajuste de Margem e Respiro */}
      <main className="flex-1 lg:ml-[340px] p-8 lg:p-20 min-h-screen">
        <div className="max-w-[1400px] mx-auto animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;


import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Building2, FileText, Settings, LogOut, ClipboardList, CreditCard } from 'lucide-react';
import { LOGO_IMAGE_URL } from '../constants';
import { useAuth } from '../context/AuthContext';

export const Logo: React.FC<{ className?: string, light?: boolean, size?: 'sm' | 'md' | 'lg' }> = ({ 
  className = "", 
  light = false,
  size = 'md' 
}) => {
  const iconSize = size === 'sm' ? 24 : size === 'lg' ? 44 : 34;
  const textSize = size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-4xl' : 'text-2xl';
  
  const nrColor = light ? "text-white" : "text-slate-900"; 
  const zenColor = light ? "text-blue-300" : "text-blue-600";
  const iconColor = light ? "#93C5FD" : "#2563EB";

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      <div className="relative flex items-center justify-center">
        <svg width={iconSize} height={iconSize} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
          <circle cx="16" cy="16" r="15" stroke={iconColor} strokeWidth="2.5" />
          <path d="M9.5 16L13.5 20L23 10.5" stroke={iconColor} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M7 23C10 21 13 25 16 25C19 25 22 21 25 23" stroke={iconColor} strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
      <div className={`font-heading tracking-tighter leading-none ${textSize}`}>
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
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/app' },
    { icon: Building2, label: 'Empresas', path: '/app/companies' },
    { icon: ClipboardList, label: 'Questionários', path: '/app/surveys' },
    { icon: FileText, label: 'Relatórios', path: '/app/reports' },
    { icon: CreditCard, label: 'Assinatura', path: '/app/billing' },
    { icon: Settings, label: 'Configurações', path: '/app/settings' },
  ];

  const getTierBadge = (tier?: string) => {
    switch(tier) {
      case 'trial': return 'Período Trial';
      case 'consultant': return 'Consultor';
      case 'business': return 'Business';
      default: return 'Acesso Restrito';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-row font-sans">
      <aside className="w-72 bg-white border-r border-slate-100 flex flex-col fixed h-full z-50 hidden lg:flex shadow-[20px_0_40px_rgba(0,0,0,0.01)]">
        <div className="p-8 border-b border-slate-50 flex items-center justify-center">
          <Link to="/" className="group hover:opacity-90 transition-opacity">
            <Logo />
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto py-8 px-6 space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/app' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.label}
                to={item.path}
                className={`flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-bold transition-all duration-300 ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20 translate-x-1' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <item.icon size={22} className={isActive ? 'text-white' : 'text-slate-400'} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-slate-50 space-y-4">
          <div className="bg-slate-50 rounded-2xl p-4 flex items-center gap-4 border border-slate-100">
             <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center text-xs font-black shadow-md">
               {user?.name?.substring(0,2).toUpperCase() || 'NR'}
             </div>
             <div className="truncate">
               <p className="text-xs font-black text-slate-900 truncate tracking-tight">{user?.name}</p>
               <p className="text-[10px] text-blue-600 font-black uppercase tracking-wider">{getTierBadge(user?.plan_tier)}</p>
             </div>
          </div>
          <button onClick={logout} className="flex items-center gap-4 w-full px-5 py-3 text-sm font-bold text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all">
            <LogOut size={22} />
            Sair da conta
          </button>
        </div>
      </aside>

      <main className="flex-1 lg:ml-72 p-6 lg:p-12 min-h-screen">
        {children}
      </main>
    </div>
  );
};

export default Layout;

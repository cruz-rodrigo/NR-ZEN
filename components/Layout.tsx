import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Building2, FileText, Settings, LogOut, ClipboardList } from 'lucide-react';
import { LOGO_IMAGE_URL } from '../constants';

export const Logo: React.FC<{ className?: string, light?: boolean, size?: 'sm' | 'md' | 'lg' }> = ({ 
  className = "", 
  light = false,
  size = 'md' 
}) => {
  if (LOGO_IMAGE_URL) {
    const imgHeight = size === 'sm' ? 'h-6' : size === 'lg' ? 'h-10' : 'h-8';
    return (
      <img 
        src={LOGO_IMAGE_URL} 
        alt="NR ZEN" 
        className={`${imgHeight} w-auto object-contain ${className}`} 
      />
    );
  }

  const iconSize = size === 'sm' ? 24 : size === 'lg' ? 40 : 32;
  const textSize = size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-4xl' : 'text-2xl';
  
  // UNIFIED COLORS: Blue-600 (#2563EB)
  const nrColor = light ? "text-white" : "text-slate-900"; 
  const zenColor = light ? "text-blue-300" : "text-blue-600";
  const iconColor = light ? "#93C5FD" : "#2563EB"; // Blue 300 / Blue 600

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      <svg 
        width={iconSize} 
        height={iconSize} 
        viewBox="0 0 32 32" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        <circle cx="16" cy="16" r="15" stroke={iconColor} strokeWidth="2.5" />
        <path 
          d="M9.5 16L13.5 20L23 10.5" 
          stroke={iconColor} 
          strokeWidth="3" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
        <path 
          d="M7 23C10 21 13 25 16 25C19 25 22 21 25 23" 
          stroke={iconColor} 
          strokeWidth="2" 
          strokeLinecap="round"
        />
      </svg>

      <div className={`font-heading tracking-tight leading-none ${textSize}`}>
        <span className={`font-extrabold ${nrColor}`}>NR</span>
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

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/app' },
    { icon: Building2, label: 'Empresas', path: '/app/companies' },
    { icon: ClipboardList, label: 'Questionários', path: '/app/surveys' },
    { icon: FileText, label: 'Relatórios', path: '/app/reports' },
    { icon: Settings, label: 'Configurações', path: '/app/settings' },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-row font-sans">
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col fixed h-full z-10 hidden md:flex shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <div className="p-6 border-b border-slate-100 flex items-center justify-center">
          <Link to="/" className="group hover:opacity-90 transition-opacity">
            <Logo />
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1.5">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/app' && location.pathname.startsWith(item.path));
            
            return (
              <Link
                key={item.label}
                to={item.path}
                // UNIFIED ACTIVE STATE: Blue-50 background, Blue-700 text
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive 
                    ? 'bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-100' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <item.icon size={20} className={isActive ? 'text-blue-600' : 'text-slate-400'} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
            <LogOut size={20} />
            Sair
          </button>
        </div>
      </aside>

      <main className="flex-1 md:ml-64 p-6 md:p-10 min-h-screen bg-[#F8FAFC]">
        {children}
      </main>
    </div>
  );
};

export default Layout;
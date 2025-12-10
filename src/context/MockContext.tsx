import React, { createContext, useContext, useState, useEffect } from 'react';
import { Company, UserSession } from '../types';

interface AppContextType {
  user: UserSession | null;
  token: string | null;
  companies: Company[];
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  addCompany: (company: Omit<Company, 'id'>) => Promise<void>;
  getCompanyStats: () => { total: number; activeSectors: number; responses: number; riskHighPercent: number };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Dados iniciais com IDs como STRING para compatibilidade com UUID
const INITIAL_COMPANIES: Company[] = [
  { id: '1', name: "Indústrias Metalúrgicas Beta", cnpj: "12.345.678/0001-99", sectorsCount: 8, sectorsActive: 8, lastCollection: "10/10/2025", status: "high" },
  { id: '2', name: "Transportadora Veloz", cnpj: "98.765.432/0001-11", sectorsCount: 4, sectorsActive: 2, lastCollection: "05/10/2025", status: "moderate" },
];

export const MockProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserSession | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('nrzen_token'));
  
  // Inicia vazio se tiver token (para forçar fetch) ou com inicial se for visitante
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ total: 0, activeSectors: 0, responses: 0, riskHighPercent: 0 });

  useEffect(() => {
    const storedUser = localStorage.getItem('nrzen_user');
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
      fetchDashboardData(token);
    } else {
      // Se não estiver logado, mostra dados de vitrine
      setCompanies(INITIAL_COMPANIES);
    }
  }, [token]);

  const fetchDashboardData = async (authToken: string) => {
    try {
      // 1. Fetch Stats
      const statsRes = await fetch('/api/dashboard/stats', {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      if (statsRes.ok) {
        setStats(await statsRes.json());
      }

      // 2. Fetch Companies Real
      const compRes = await fetch('/api/companies', {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      
      if (compRes.ok) {
        const realCompanies = await compRes.json();
        // Mapeia do banco para o front se necessário, ou usa direto se a API retornar certinho
        // O endpoint api/companies retorna campos snake_case, o front espera camelCase ou compatível?
        // Vamos garantir que a API retorne o formato certo.
        setCompanies(realCompanies);
      } 

    } catch (e) {
      console.error("Erro ao buscar dados:", e);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao realizar login');

      const userData: UserSession = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        plan_tier: data.user.plan_tier as any
      };

      setToken(data.token);
      setUser(userData);
      localStorage.setItem('nrzen_token', data.token);
      localStorage.setItem('nrzen_user', JSON.stringify(userData));
      
      fetchDashboardData(data.token);

    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao registrar');
      await login(email, password);
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setCompanies(INITIAL_COMPANIES);
    localStorage.removeItem('nrzen_token');
    localStorage.removeItem('nrzen_user');
    window.location.href = '/login';
  };

  const addCompany = async (companyData: Omit<Company, 'id'>) => {
    // Tenta API
    try {
        if(token) {
            const res = await fetch('/api/companies', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(companyData)
            });
            if (res.ok) {
                fetchDashboardData(token);
                return;
            }
        }
    } catch(e) { console.error(e); }

    // Fallback Local
    const newComp: Company = { 
        ...companyData, 
        id: crypto.randomUUID(), // Gera UUID válido no browser
        status: 'low' 
    };
    setCompanies(prev => [newComp, ...prev]);
  };

  const getCompanyStats = () => {
    return stats;
  };

  return (
    <AppContext.Provider value={{ 
      user, token, companies, loading, login, register, logout, addCompany, getCompanyStats 
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useMockData = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useMockData deve ser usado dentro de um MockProvider');
  }
  return context;
};
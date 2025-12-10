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

export const MockProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserSession | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('nrzen_token'));
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ total: 0, activeSectors: 0, responses: 0, riskHighPercent: 0 });

  // Ao carregar, verifica se tem token e tenta restaurar sessão e dados
  useEffect(() => {
    const storedUser = localStorage.getItem('nrzen_user');
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
      fetchDashboardData(token);
    }
  }, [token]);

  const fetchDashboardData = async (authToken: string) => {
    try {
      // 1. Fetch Stats
      const statsRes = await fetch('/api/dashboard/stats', {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      // 2. Fetch Companies
      // Nota: Como o endpoint /api/companies ainda não foi totalmente implementado na iteração anterior,
      // aqui mantemos um fallback seguro, mas a estrutura está pronta para a API.
      /*
      const compRes = await fetch('/api/companies', {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      if (compRes.ok) {
        const compData = await compRes.json();
        setCompanies(compData);
      }
      */
     
      // MOCK FALLBACK (Para você ver dados enquanto não cadastra empresas reais)
      if (companies.length === 0) {
        setCompanies([
          { id: '1', name: "Exemplo Metalúrgica", cnpj: "00.000.000/0001-00", sectorsCount: 3, sectorsActive: 1, lastCollection: "Demo", status: "moderate" }
        ]);
      }

    } catch (e) {
      console.error("Erro ao buscar dados do dashboard:", e);
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
      
      if (!res.ok) {
        throw new Error(data.error || 'Erro ao realizar login');
      }

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
      
      // Busca dados imediatamente após login
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
      
      // Auto login
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
    setCompanies([]);
    localStorage.removeItem('nrzen_token');
    localStorage.removeItem('nrzen_user');
    window.location.href = '/login';
  };

  const addCompany = async (companyData: Omit<Company, 'id'>) => {
    // Tenta enviar para a API real
    try {
        /*
        const res = await fetch('/api/companies', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(companyData)
        });
        if (res.ok) fetchDashboardData(token!);
        */
       
       // Fallback visual
       const newComp: Company = { ...companyData, id: crypto.randomUUID(), status: 'low' };
       setCompanies(prev => [newComp, ...prev]);

    } catch (e) {
        console.error(e);
    }
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
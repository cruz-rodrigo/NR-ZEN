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

// Dados iniciais (Seed Data)
const INITIAL_COMPANIES: Company[] = [
  { id: '1', name: "Indústrias Metalúrgicas Beta", cnpj: "12.345.678/0001-99", sectorsCount: 8, sectorsActive: 8, lastCollection: "10/10/2025", status: "high" },
  { id: '2', name: "Transportadora Veloz", cnpj: "98.765.432/0001-11", sectorsCount: 4, sectorsActive: 2, lastCollection: "05/10/2025", status: "moderate" },
  { id: '3', name: "Call Center Solutions", cnpj: "11.222.333/0001-00", sectorsCount: 12, sectorsActive: 12, lastCollection: "12/10/2025", status: "high" },
  { id: '4', name: "Tech Softwares", cnpj: "44.555.666/0001-22", sectorsCount: 3, sectorsActive: 0, lastCollection: "20/09/2025", status: "low" },
  { id: '5', name: "Rede Varejo Express", cnpj: "33.444.555/0001-66", sectorsCount: 20, sectorsActive: 18, lastCollection: "Hoje", status: "low" },
];

export const MockProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserSession | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('nrzen_token'));
  
  // Inicia COM dados mockados por padrão. Se a API responder, atualizamos.
  const [companies, setCompanies] = useState<Company[]>(INITIAL_COMPANIES);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ 
    total: 5, 
    activeSectors: 40, 
    responses: 142, 
    riskHighPercent: 40 
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('nrzen_user');
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
      fetchDashboardData(token);
    }
  }, [token]);

  const fetchDashboardData = async (authToken: string) => {
    try {
      // Tenta buscar estatísticas
      const statsRes = await fetch('/api/dashboard/stats', {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      } else {
        console.warn("API de Stats indisponível, usando dados locais.");
      }

      // Tenta buscar empresas reais
      const compRes = await fetch('/api/companies', {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      
      if (compRes.ok) {
        const realCompanies = await compRes.json();
        if (Array.isArray(realCompanies) && realCompanies.length > 0) {
           setCompanies(realCompanies);
        }
      } else {
        console.warn("API de Companies indisponível, mantendo dados de exemplo.");
      }

    } catch (e) {
      console.warn("Backend offline ou não configurado. Usando modo Mock.", e);
      // Não faz nada, mantém os dados iniciais do useState
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Simulação de "Bypass" caso a API não exista (para teste de UI)
      // Se quiser testar o layout sem backend, descomente as linhas abaixo se o fetch falhar
      /*
      if (email === "demo@nrzen.com") {
         const mockUser: UserSession = { id: 'demo', name: 'Usuário Demo', email, plan_tier: 'business' };
         setUser(mockUser);
         setToken('mock_token');
         localStorage.setItem('nrzen_token', 'mock_token');
         localStorage.setItem('nrzen_user', JSON.stringify(mockUser));
         setLoading(false);
         return;
      }
      */

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
      // Fallback para login de demonstração se a API falhar (DX melhorada)
      if (email.includes('demo') || email.includes('teste')) {
          console.log("Ativando modo demonstração local devido a erro na API.");
          const mockUser: UserSession = { id: 'local', name: 'Demo Local', email, plan_tier: 'business' };
          setUser(mockUser);
          setToken('local_token');
          localStorage.setItem('nrzen_token', 'local_token');
          localStorage.setItem('nrzen_user', JSON.stringify(mockUser));
      } else {
          throw error;
      }
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
      // Fallback local
      await login(email, password);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setCompanies(INITIAL_COMPANIES); // Reseta para os dados iniciais
    localStorage.removeItem('nrzen_token');
    localStorage.removeItem('nrzen_user');
    window.location.href = '/login';
  };

  const addCompany = async (companyData: Omit<Company, 'id'>) => {
    // Tenta API primeiro
    try {
        if(token && token !== 'local_token' && token !== 'mock_token') {
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

    // Fallback Local (Atualiza o estado localmente para feedback imediato)
    const newComp: Company = { 
        ...companyData, 
        id: crypto.randomUUID(), 
        status: 'low',
        sectorsCount: 1,
        sectorsActive: 1,
        lastCollection: 'Hoje'
    };
    
    setCompanies(prev => [newComp, ...prev]);
    
    // Atualiza stats locais simples
    setStats(prev => ({
        ...prev,
        total: prev.total + 1,
        activeSectors: prev.activeSectors + 1
    }));
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

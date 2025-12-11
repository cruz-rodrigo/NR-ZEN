import React, { createContext, useContext, useState, useEffect } from 'react';
import { Company, UserSession } from '../types';
import { supabase } from '../lib/supabaseClient';

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

// Dados de fallback visual caso o banco esteja vazio
const INITIAL_COMPANIES: Company[] = [];

export const MockProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserSession | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('nrzen_token'));
  const [companies, setCompanies] = useState<Company[]>(INITIAL_COMPANIES);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ 
    total: 0, 
    activeSectors: 0, 
    responses: 0, 
    riskHighPercent: 0 
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('nrzen_user');
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
      fetchDashboardData(JSON.parse(storedUser).id);
    }
  }, [token]);

  // Função unificada para buscar dados (API -> Supabase Client -> Mock)
  const fetchDashboardData = async (userId: string) => {
    try {
      // 1. Tenta API Serverless (Produção)
      const res = await fetch('/api/companies', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (res.ok) {
        const data = await res.json();
        setCompanies(data);
        updateStats(data);
        return;
      }
      throw new Error("API Indisponível");

    } catch (e) {
      // 2. Fallback: Conexão Direta Supabase (Desenvolvimento Local)
      console.log("Modo Dev: Buscando dados diretamente do Supabase...");
      
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (!error && data) {
        // Adaptar dados do banco para o frontend
        const adaptedCompanies: Company[] = data.map(c => ({
          ...c,
          sectorsCount: 0, // Necessitaria de join
          sectorsActive: 0,
          lastCollection: 'N/A'
        }));
        setCompanies(adaptedCompanies);
        updateStats(adaptedCompanies);
      } else {
        console.warn("Erro ao buscar do Supabase ou banco vazio:", error);
      }
    }
  };

  const updateStats = (currentCompanies: Company[]) => {
    setStats({
      total: currentCompanies.length,
      activeSectors: currentCompanies.reduce((acc, c) => acc + (c.sectorsActive || 0), 0),
      responses: 142, // Mock fixo por enquanto
      riskHighPercent: currentCompanies.length > 0 
        ? Math.round((currentCompanies.filter(c => c.status === 'high').length / currentCompanies.length) * 100) 
        : 0
    });
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // 1. Tenta API
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      if (res.ok) {
        const data = await res.json();
        handleAuthSuccess(data.token, data.user);
        return;
      }

      // 2. Fallback: Verifica tabela 'users' customizada diretamente
      // NOTA DE SEGURANÇA: Em produção, NUNCA faça login direto no cliente sem hash.
      // Isso é apenas para validar a conexão com a tabela que você criou.
      console.log("Modo Dev: Tentando login direto no Supabase...");
      
      const { data: userRecord, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (error || !userRecord) throw new Error('Usuário não encontrado ou credenciais inválidas.');

      // Simula token e sucesso
      const fakeToken = `dev-token-${userRecord.id}`;
      const userData: UserSession = {
        id: userRecord.id,
        name: userRecord.name,
        email: userRecord.email,
        plan_tier: userRecord.plan_tier || 'free'
      };
      
      handleAuthSuccess(fakeToken, userData);

    } catch (error: any) {
      console.error(error);
      throw new Error(error.message || 'Erro ao realizar login');
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      // 1. Tenta API
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      if (res.ok) {
        await login(email, password);
        return;
      }

      // 2. Fallback: Insere na tabela 'users' diretamente
      console.log("Modo Dev: Registrando direto no Supabase...");
      
      const { error } = await supabase
        .from('users')
        .insert([{
          name,
          email,
          password_hash: 'hash-simulado-local', // API serverless faria o hash real
          plan_tier: 'free'
        }]);

      if (error) throw error;
      await login(email, password);

    } catch (error: any) {
      console.error(error);
      throw new Error(error.message || 'Erro ao registrar');
    } finally {
      setLoading(false);
    }
  };

  const handleAuthSuccess = (newToken: string, newUser: UserSession) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('nrzen_token', newToken);
    localStorage.setItem('nrzen_user', JSON.stringify(newUser));
    fetchDashboardData(newUser.id);
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
    if (!user) return;

    // Prepara objeto para inserção
    const payload = {
      user_id: user.id,
      name: companyData.name,
      cnpj: companyData.cnpj,
      status: 'active'
    };

    try {
      // 1. Tenta API
      const res = await fetch('/api/companies', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        fetchDashboardData(user.id);
        return;
      }

      // 2. Fallback: Insert direto
      console.log("Modo Dev: Criando empresa direto no Supabase...");
      const { error } = await supabase.from('companies').insert([payload]);
      
      if (error) throw error;
      fetchDashboardData(user.id);

    } catch(e) { 
      console.error("Erro ao adicionar empresa:", e);
      alert("Erro ao salvar no banco de dados.");
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

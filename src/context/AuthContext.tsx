import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserSession } from '../types';

interface AuthContextType {
  user: UserSession | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginDemo: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  apiCall: (endpoint: string, options?: RequestInit) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserSession | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Carrega sessão do localStorage ao iniciar
  useEffect(() => {
    const storedToken = localStorage.getItem('nrzen_token');
    const storedUser = localStorage.getItem('nrzen_user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Erro ao parsear usuário armazenado", e);
        localStorage.removeItem('nrzen_user');
      }
    }
    setIsLoading(false);
  }, []);

  const loginDemo = () => {
    const mockUser: UserSession = {
      id: 'demo-user-id',
      name: 'Usuário Demo (Offline)',
      email: 'demo@nrzen.com',
      plan_tier: 'business'
    };
    const demoToken = 'demo-token-jwt';
    
    setToken(demoToken);
    setUser(mockUser);
    localStorage.setItem('nrzen_token', demoToken);
    localStorage.setItem('nrzen_user', JSON.stringify(mockUser));
  };

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const contentType = res.headers.get("content-type");
      
      // 1. Tratamento de Erro de Credencial (401)
      if (res.status === 401) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'E-mail ou senha incorretos.');
      }

      // 2. Fallback para Erro de Servidor/Rede (Ativa Demo se API estiver fora)
      if (!res.ok || !contentType || !contentType.includes("application/json")) {
        console.warn("API indisponível (Erro 500 ou Network). Ativando Modo Demo Local.");
        await new Promise(resolve => setTimeout(resolve, 800)); // Delay UX
        loginDemo();
        return;
      }

      // 3. Sucesso
      const data = await res.json();
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('nrzen_token', data.token);
      localStorage.setItem('nrzen_user', JSON.stringify(data.user));

    } catch (err: any) {
      // Se for erro de credencial, repassa o erro para a UI
      if (err.message === 'E-mail ou senha incorretos.') {
        throw err;
      }
      
      console.error("Erro de conexão no login:", err);
      // Se for erro de rede (fetch failed), entra no modo demo como fallback
      loginDemo();
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json") || !res.ok) {
         // Se a API não responder JSON, pode ser erro 500 do Vercel
         const text = await res.text();
         console.error("Erro no registro:", text);
         throw new Error("Erro ao conectar com o servidor de registro.");
      }

      const data = await res.json();
      if (data.error) throw new Error(data.error);

    } catch (err: any) {
      console.error("Erro no registro:", err);
      throw err; 
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('nrzen_token');
    localStorage.removeItem('nrzen_user');
    window.location.href = '/';
  };

  const apiCall = async (endpoint: string, options: RequestInit = {}) => {
    if (!token) throw new Error("Usuário não autenticado");

    // Se estiver em modo Demo (token falso), retorna null imediatamente 
    if (token === 'demo-token-jwt') {
      return null; 
    }

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    };

    try {
      const res = await fetch(endpoint, { ...options, headers });
      
      if (res.status === 401) {
        logout();
        throw new Error("Sessão expirada");
      }

      if (res.status === 204) return null;

      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        return null;
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro na requisição');
      
      return data;
    } catch (error) {
      console.error(`Erro na chamada API ${endpoint}:`, error);
      return null; 
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      isAuthenticated: !!token, 
      isLoading, 
      login, 
      loginDemo,
      register, 
      logout,
      apiCall 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
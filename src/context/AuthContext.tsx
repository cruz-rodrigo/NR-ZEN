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
      
      // Validação Estrita de Erro de Servidor
      if (!contentType || !contentType.includes("application/json")) {
        const text = await res.text();
        console.error("Login Response (Non-JSON):", text);
        throw new Error(`Erro do Servidor: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'E-mail ou senha incorretos.');
      }

      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('nrzen_token', data.token);
      localStorage.setItem('nrzen_user', JSON.stringify(data.user));

    } catch (err: any) {
      console.error("Erro no login:", err);
      throw err; // Repassa o erro real para a UI
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
      
      if (!contentType || !contentType.includes("application/json")) {
         const text = await res.text();
         console.error("Register Response (Non-JSON):", text);
         throw new Error(`Erro do Servidor: ${res.status} ${res.statusText}. Verifique conexão com DB.`);
      }

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Erro ao registrar usuário.');
      }

    } catch (err: any) {
      console.error("Erro no registro:", err);
      throw err; // Repassa o erro real para a UI
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

    // Se estiver em modo Demo (token falso), retorna null ou simula
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
        throw new Error(`Resposta inválida da API em ${endpoint}`);
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro na requisição');
      
      return data;
    } catch (error) {
      console.error(`Erro na chamada API ${endpoint}:`, error);
      throw error; // Lança o erro para ser tratado pelo componente
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
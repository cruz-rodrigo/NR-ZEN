
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
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserSession | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Carrega sessão do localStorage ao iniciar
  useEffect(() => {
    const storedToken = localStorage.getItem('nrzen_token');
    const storedRefreshToken = localStorage.getItem('nrzen_refresh_token');
    const storedUser = localStorage.getItem('nrzen_user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      if (storedRefreshToken) setRefreshToken(storedRefreshToken);
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Erro ao parsear usuário armazenado", e);
        localStorage.removeItem('nrzen_user');
      }
    }
    setIsLoading(false);
  }, []);

  /**
   * Atualiza os dados do usuário atual consultando o backend.
   * Essencial após checkouts de sucesso para atualizar o plan_tier.
   */
  const refreshUser = async () => {
    if (!token || token === 'demo-token-jwt') return;
    try {
      const data = await apiCall('/api/auth?action=me');
      if (data && data.user) {
        setUser(data.user);
        localStorage.setItem('nrzen_user', JSON.stringify(data.user));
      }
    } catch (e) {
      console.error("Erro ao atualizar dados do usuário", e);
    }
  };

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
      const res = await fetch('/api/auth?action=login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const contentType = res.headers.get("content-type");
      
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
      setRefreshToken(data.refreshToken);
      setUser(data.user);
      
      localStorage.setItem('nrzen_token', data.token);
      if (data.refreshToken) {
        localStorage.setItem('nrzen_refresh_token', data.refreshToken);
      }
      localStorage.setItem('nrzen_user', JSON.stringify(data.user));

    } catch (err: any) {
      console.error("Erro no login:", err);
      throw err;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const res = await fetch('/api/auth?action=register', {
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
      throw err;
    }
  };

  const logout = () => {
    setToken(null);
    setRefreshToken(null);
    setUser(null);
    localStorage.removeItem('nrzen_token');
    localStorage.removeItem('nrzen_refresh_token');
    localStorage.removeItem('nrzen_user');
    window.location.href = '/';
  };

  const handleRefresh = async (): Promise<string | null> => {
    const currentRefreshToken = localStorage.getItem('nrzen_refresh_token');
    if (!currentRefreshToken) return null;

    try {
      const res = await fetch('/api/auth?action=refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: currentRefreshToken }),
      });

      if (!res.ok) return null;

      const data = await res.json();
      
      setToken(data.token);
      setRefreshToken(data.refreshToken);
      localStorage.setItem('nrzen_token', data.token);
      localStorage.setItem('nrzen_refresh_token', data.refreshToken);
      
      return data.token;
    } catch (e) {
      console.error("Failed to refresh token", e);
      return null;
    }
  };

  const apiCall = async (endpoint: string, options: RequestInit = {}) => {
    if (!token) throw new Error("Usuário não autenticado");

    if (token === 'demo-token-jwt') {
      return null; 
    }

    let currentToken = token;

    const performRequest = async (tokenToUse: string) => {
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tokenToUse}`,
        ...options.headers,
      };
      return fetch(endpoint, { ...options, headers });
    };

    try {
      let res = await performRequest(currentToken);
      
      // Token Expired / Invalid
      if (res.status === 401) {
        const newToken = await handleRefresh();
        
        if (newToken) {
          currentToken = newToken;
          res = await performRequest(newToken);
        } else {
          logout();
          throw new Error("Sessão expirada");
        }
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
      throw error;
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
      apiCall,
      refreshUser
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

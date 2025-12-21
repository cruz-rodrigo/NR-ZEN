
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
        localStorage.removeItem('nrzen_user');
      }
    }
    setIsLoading(false);
  }, []);

  const refreshUser = async () => {
    if (!token || token === 'demo-token-jwt') return;
    try {
      // Endpoint que retorna o perfil atualizado do banco
      const data = await apiCall('/api/auth/me'); 
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
    const res = await fetch('/api/auth?action=login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'E-mail ou senha incorretos.');

    setToken(data.token);
    setRefreshToken(data.refreshToken);
    setUser(data.user);
    localStorage.setItem('nrzen_token', data.token);
    if (data.refreshToken) localStorage.setItem('nrzen_refresh_token', data.refreshToken);
    localStorage.setItem('nrzen_user', JSON.stringify(data.user));
  };

  const register = async (name: string, email: string, password: string) => {
    const res = await fetch('/api/auth?action=register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erro ao registrar usuário.');
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.clear();
    window.location.href = '/';
  };

  const apiCall = async (endpoint: string, options: RequestInit = {}) => {
    if (!token) throw new Error("Usuário não autenticado");
    if (token === 'demo-token-jwt') return null;

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    };

    const res = await fetch(endpoint, { ...options, headers });
    if (res.status === 204) return null;
    
    const contentType = res.headers.get("content-type");
    const data = contentType && contentType.includes("application/json") ? await res.json() : null;
    
    if (!res.ok) throw new Error(data?.error || 'Erro na requisição');
    return data;
  };

  return (
    <AuthContext.Provider value={{ 
      user, token, isAuthenticated: !!token, isLoading, 
      login, loginDemo, register, logout, apiCall, refreshUser 
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

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserSession } from '../types';

interface AuthContextType {
  user: UserSession | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
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

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("O servidor não retornou JSON. Verifique se a API está rodando (Preview Mode).");
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Falha no login');

      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('nrzen_token', data.token);
      localStorage.setItem('nrzen_user', JSON.stringify(data.user));
    } catch (err) {
      console.error(err);
      throw err;
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
         throw new Error("Erro de conexão com API de cadastro.");
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Falha no cadastro');
    } catch (err) {
      console.error(err);
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

  // Helper para chamadas de API autenticadas
  const apiCall = async (endpoint: string, options: RequestInit = {}) => {
    // Modo Preview: Se não tiver token, tenta retornar null ou throw suave
    if (!token) throw new Error("Usuário não autenticado");

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

      // Proteção contra respostas HTML (404/500 do servidor de preview)
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        // Se a API não responder JSON, retornamos null ou array vazio para não quebrar a UI
        console.warn(`A rota ${endpoint} não retornou JSON. Provavelmente ambiente de preview sem backend.`);
        return null;
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
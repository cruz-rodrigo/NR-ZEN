// Deprecated. See src/context/AuthContext.tsx
import React from 'react';
export const AuthProvider: React.FC<{children: React.ReactNode}> = ({children}) => <>{children}</>;
export const useAuth = () => ({ 
  user: null, 
  token: null,
  isAuthenticated: false, 
  isLoading: false,
  login: async (email: string, password: string) => {}, 
  logout: () => {}, 
  register: async (name: string, email: string, password: string) => {}, 
  apiCall: async (endpoint: string, options?: any) => { return null; } 
});
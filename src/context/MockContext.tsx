import React, { createContext, useContext } from 'react';
import { Company } from '../types';

// CONTEXTO DEPRECIADO: ESTAMOS USANDO SUPABASE AGORA.
// Mantido vazio apenas para evitar erros de compilação em arquivos que ainda importam useMockData.

interface MockContextType {
  companies: Company[];
  addCompany: (company: any) => void;
  getCompanyStats: () => { total: number; activeSectors: number; responses: number; riskHighPercent: number };
}

const MockContext = createContext<MockContextType | undefined>(undefined);

export const MockProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Retorna funções vazias ou dados zerados
  const value = {
    companies: [],
    addCompany: () => console.warn("MockData is disabled. Use API."),
    getCompanyStats: () => ({ total: 0, activeSectors: 0, responses: 0, riskHighPercent: 0 })
  };

  return (
    <MockContext.Provider value={value}>
      {children}
    </MockContext.Provider>
  );
};

export const useMockData = () => {
  const context = useContext(MockContext);
  if (!context) {
    // Retorna fallback seguro em vez de quebrar a app
    return {
       companies: [],
       addCompany: () => {},
       getCompanyStats: () => ({ total: 0, activeSectors: 0, responses: 0, riskHighPercent: 0 })
    };
  }
  return context;
};
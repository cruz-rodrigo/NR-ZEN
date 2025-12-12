import React, { createContext, useContext, useState, useEffect } from 'react';
import { Company } from '../types';

interface MockContextType {
  companies: Company[];
  addCompany: (company: Omit<Company, 'id'>) => void;
  getCompanyStats: () => { total: number; activeSectors: number; responses: number; riskHighPercent: number };
}

const MockContext = createContext<MockContextType | undefined>(undefined);

// Dados iniciais (Seed Data) para o sistema não começar vazio
const INITIAL_COMPANIES: Company[] = [
  { id: '1', name: "Indústrias Metalúrgicas Beta", cnpj: "12.345.678/0001-99", sectorsCount: 8, sectorsActive: 8, lastCollection: "10/10/2025", status: "high" },
  { id: '2', name: "Transportadora Veloz", cnpj: "98.765.432/0001-11", sectorsCount: 4, sectorsActive: 2, lastCollection: "05/10/2025", status: "moderate" },
  { id: '3', name: "Call Center Solutions", cnpj: "11.222.333/0001-00", sectorsCount: 12, sectorsActive: 12, lastCollection: "12/10/2025", status: "high" },
  { id: '4', name: "Tech Softwares", cnpj: "44.555.666/0001-22", sectorsCount: 3, sectorsActive: 0, lastCollection: "20/09/2025", status: "low" },
  { id: '5', name: "Rede Varejo Express", cnpj: "33.444.555/0001-66", sectorsCount: 20, sectorsActive: 18, lastCollection: "Hoje", status: "low" },
];

export const MockProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Tenta carregar do localStorage ou usa o inicial
  const [companies, setCompanies] = useState<Company[]>(() => {
    const saved = localStorage.getItem('nrzen_companies');
    return saved ? JSON.parse(saved) : INITIAL_COMPANIES;
  });

  // Salva no localStorage sempre que mudar (Persistência)
  useEffect(() => {
    localStorage.setItem('nrzen_companies', JSON.stringify(companies));
  }, [companies]);

  const addCompany = (newCompanyData: Omit<Company, 'id'>) => {
    const newCompany: Company = {
      ...newCompanyData,
      id: String(Math.max(...companies.map(c => Number(c.id) || 0), 0) + 1), // Auto-increment ID simples
    };
    setCompanies(prev => [newCompany, ...prev]); // Adiciona no topo da lista
  };

  const getCompanyStats = () => {
    const total = companies.length;
    const activeSectors = companies.reduce((acc, curr) => acc + (curr.sectorsActive || 0), 0);
    // Simulação de cálculo de respostas baseado em setores ativos para dar vida ao dashboard
    const responses = activeSectors * 15 + 23; 
    
    const highRiskCount = companies.filter(c => c.status === 'high').length;
    const riskHighPercent = total > 0 ? Math.round((highRiskCount / total) * 100) : 0;

    return { total, activeSectors, responses, riskHighPercent };
  };

  return (
    <MockContext.Provider value={{ companies, addCompany, getCompanyStats }}>
      {children}
    </MockContext.Provider>
  );
};

export const useMockData = () => {
  const context = useContext(MockContext);
  if (!context) {
    throw new Error('useMockData must be used within a MockProvider');
  }
  return context;
};
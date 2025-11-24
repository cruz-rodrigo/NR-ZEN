import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Companies from './pages/Companies';
import Surveys from './pages/Surveys';
import Settings from './pages/Settings';
import Onboarding from './pages/Onboarding';
import SectorDetail from './pages/SectorDetail';
import Questionnaire from './pages/Questionnaire';
import Report from './pages/Report';
import DemoLogin from './pages/DemoLogin';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        
        {/* App Routes */}
        <Route path="/app" element={<Dashboard />} />
        <Route path="/app/companies" element={<Companies />} />
        <Route path="/app/surveys" element={<Surveys />} />
        <Route path="/app/settings" element={<Settings />} />
        <Route path="/app/onboarding" element={<Onboarding />} />
        
        <Route path="/app/setor/:id" element={<SectorDetail />} />
        
        {/* Demo Flow (Worker/Respondent View) */}
        <Route path="/demo" element={<DemoLogin />} />
        <Route path="/questionario" element={<Questionnaire />} />
        
        {/* Utilities */}
        <Route path="/relatorio" element={<Report />} />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
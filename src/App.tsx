import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Companies from './pages/Companies';
import Surveys from './pages/Surveys';
import Settings from './pages/Settings';
import Onboarding from './pages/Onboarding';
import SectorDetail from './pages/SectorDetail';
import Questionnaire from './pages/Questionnaire';
import Report from './pages/Report';
import DemoLogin from './pages/DemoLogin';
import TestDb from './pages/TestDb';
import { PaymentSuccess, PaymentCancel } from './pages/PaymentResult';
import { AuthProvider, useAuth } from './context/AuthContext';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Payment Flow Routes */}
          <Route path="/payment/success" element={<PaymentSuccess />} />
          <Route path="/payment/cancel" element={<PaymentCancel />} />
          
          {/* App Routes (Protected) */}
          <Route path="/app" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/app/companies" element={<PrivateRoute><Companies /></PrivateRoute>} />
          <Route path="/app/surveys" element={<PrivateRoute><Surveys /></PrivateRoute>} />
          <Route path="/app/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
          <Route path="/app/onboarding" element={<PrivateRoute><Onboarding /></PrivateRoute>} />
          <Route path="/app/setor/:id" element={<PrivateRoute><SectorDetail /></PrivateRoute>} />
          
          {/* Demo/Public Flow */}
          <Route path="/demo" element={<DemoLogin />} />
          {/* Rota ajustada para aceitar ID opcional (ex: /questionario/ref-123) */}
          <Route path="/questionario" element={<Questionnaire />} />
          <Route path="/questionario/:code" element={<Questionnaire />} />
          
          {/* Utilities */}
          <Route path="/relatorio" element={<Report />} />
          <Route path="/test-db" element={<TestDb />} />
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;

import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage.tsx';
import Login from './pages/Login.tsx';
import Register from './pages/Register.tsx';
import FreeTest from './pages/FreeTest.tsx';
import Dashboard from './pages/Dashboard.tsx';
import Companies from './pages/Companies.tsx';
import Surveys from './pages/Surveys.tsx';
import Reports from './pages/Reports.tsx';
import Settings from './pages/Settings.tsx';
import Billing from './pages/Billing.tsx';
import SectorDetail from './pages/SectorDetail.tsx';
import Report from './pages/Report.tsx';
import Onboarding from './pages/Onboarding.tsx';
import Questionnaire from './pages/Questionnaire.tsx';
import CheckoutOrchestrator from './pages/CheckoutOrchestrator.tsx';
import { PaymentSuccess, PaymentCancel } from './pages/PaymentResult.tsx';
import ForgotPassword from './pages/ForgotPassword.tsx';
import ResetPassword from './pages/ResetPassword.tsx';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { MockProvider } from './context/MockContext.tsx';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <div className="h-screen w-full flex items-center justify-center bg-slate-50"><div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent"></div></div>;
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <MockProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/teste-gratis" element={<FreeTest />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            
            {/* Orchestrator - SEMPRE PÚBLICO para evitar expulsão por lag de estado */}
            <Route path="/checkout/start" element={<CheckoutOrchestrator />} />
            
            {/* Authenticated Routes */}
            <Route path="/app" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/app/companies" element={<PrivateRoute><Companies /></PrivateRoute>} />
            <Route path="/app/surveys" element={<PrivateRoute><Surveys /></PrivateRoute>} />
            <Route path="/app/reports" element={<PrivateRoute><Reports /></PrivateRoute>} />
            <Route path="/app/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
            <Route path="/app/billing" element={<PrivateRoute><Billing /></PrivateRoute>} />
            <Route path="/app/onboarding" element={<PrivateRoute><Onboarding /></PrivateRoute>} />
            <Route path="/app/setor/:id" element={<PrivateRoute><SectorDetail /></PrivateRoute>} />
            <Route path="/billing/success" element={<PrivateRoute><PaymentSuccess /></PrivateRoute>} />
            <Route path="/billing/cancel" element={<PrivateRoute><PaymentCancel /></PrivateRoute>} />
            
            {/* Survey / Public Views */}
            <Route path="/questionario" element={<Questionnaire />} />
            <Route path="/questionario/:code" element={<Questionnaire />} />
            <Route path="/relatorio" element={<Report />} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </MockProvider>
    </AuthProvider>
  );
};

export default App;

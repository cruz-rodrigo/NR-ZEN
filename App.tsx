
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage.tsx';
import Login from './pages/Login.tsx';
import Register from './pages/Register.tsx';
import FreeTest from './pages/FreeTest.tsx';
import ForgotPassword from './pages/ForgotPassword.tsx';
import ResetPassword from './pages/ResetPassword.tsx';
import Dashboard from './pages/Dashboard.tsx';
import Companies from './pages/Companies.tsx';
import Surveys from './pages/Surveys.tsx';
import Reports from './pages/Reports.tsx';
import Settings from './pages/Settings.tsx';
import Billing from './pages/Billing.tsx';
import SectorDetail from './pages/SectorDetail.tsx';
import Report from './pages/Report.tsx';
import DemoLogin from './pages/DemoLogin.tsx';
import Onboarding from './pages/Onboarding.tsx';
import Questionnaire from './pages/Questionnaire.tsx';
import CheckoutOrchestrator from './pages/CheckoutOrchestrator.tsx';
import { PaymentSuccess, PaymentCancel } from './pages/PaymentResult.tsx';
import TestDb from './pages/TestDb.tsx';
import { AuthProvider } from './context/AuthContext.tsx';
import { MockProvider } from './context/MockContext.tsx';

/**
 * Root Application Component
 * Configures the global state providers and application routing structure.
 */
const App: React.FC = () => {
  return (
    <AuthProvider>
      <MockProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/demo" element={<DemoLogin />} />
            <Route path="/teste-gratis" element={<FreeTest />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/checkout/start" element={<CheckoutOrchestrator />} />
            
            {/* Authenticated Dashboard Routes */}
            <Route path="/app" element={<Dashboard />} />
            <Route path="/app/companies" element={<Companies />} />
            <Route path="/app/surveys" element={<Surveys />} />
            <Route path="/app/reports" element={<Reports />} />
            <Route path="/app/settings" element={<Settings />} />
            <Route path="/app/billing" element={<Billing />} />
            <Route path="/app/billing/success" element={<PaymentSuccess />} />
            <Route path="/app/billing/cancel" element={<PaymentCancel />} />
            <Route path="/app/setor/:id" element={<SectorDetail />} />
            <Route path="/app/onboarding" element={<Onboarding />} />
            
            {/* Document and Survey Views */}
            <Route path="/relatorio" element={<Report />} />
            <Route path="/questionario" element={<Questionnaire />} />
            <Route path="/questionario/:code" element={<Questionnaire />} />
            <Route path="/test-db" element={<TestDb />} />

            {/* Fallback to Home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </MockProvider>
    </AuthProvider>
  );
};

// Fixed: Explicit default export to resolve import errors in index.tsx
export default App;

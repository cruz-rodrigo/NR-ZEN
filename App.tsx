
import React, { ReactNode, ErrorInfo, Component } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage.tsx';
import Login from './pages/Login.tsx';
import Register from './pages/Register.tsx';
import ForgotPassword from './pages/ForgotPassword.tsx';
import ResetPassword from './pages/ResetPassword.tsx';
import Dashboard from './pages/Dashboard.tsx';
import Companies from './pages/Companies.tsx';
import Surveys from './pages/Surveys.tsx';
import Settings from './pages/Settings.tsx';
import Billing from './pages/Billing.tsx';
import Onboarding from './pages/Onboarding.tsx';
import SectorDetail from './pages/SectorDetail.tsx';
import Questionnaire from './pages/Questionnaire.tsx';
import Report from './pages/Report.tsx';
import Reports from './pages/Reports.tsx';
import DemoLogin from './pages/DemoLogin.tsx';
import TestDb from './pages/TestDb.tsx';
import { PaymentSuccess, PaymentCancel } from './pages/PaymentResult.tsx';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

interface EBProps {
  children?: ReactNode;
}

interface EBState {
  hasError: boolean;
  error?: Error;
}

// Fix: Changed 'extends Component' to 'extends React.Component' to ensure 'this.props' is correctly typed and recognized by TypeScript
class ErrorBoundary extends React.Component<EBProps, EBState> {
  public state: EBState = { hasError: false };

  constructor(props: EBProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): EBState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("CRITICAL UI ERROR:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center">
          <div className="bg-white p-10 rounded-2xl shadow-2xl max-w-md border-t-8 border-red-600">
            <AlertTriangle className="mx-auto text-red-600 mb-6" size={64} />
            <h1 className="text-2xl font-bold text-slate-900 mb-4">Falha no Carregamento</h1>
            <p className="text-slate-600 mb-8 text-sm leading-relaxed">
              Ocorreu um erro ao carregar os módulos da aplicação. Isso pode ser causado por cache antigo no seu navegador.
            </p>
            <button 
              onClick={() => {
                localStorage.clear();
                window.location.href = '/';
              }} 
              className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
            >
              <RefreshCcw size={18} /> Reiniciar e Limpar Cache
            </button>
          </div>
        </div>
      );
    }
    // Fix: Accessing children from props
    return this.props.children;
  }
}

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            
            <Route path="/payment/success" element={<PaymentSuccess />} />
            <Route path="/payment/cancel" element={<PaymentCancel />} />
            
            <Route path="/app" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/app/companies" element={<PrivateRoute><Companies /></PrivateRoute>} />
            <Route path="/app/surveys" element={<PrivateRoute><Surveys /></PrivateRoute>} />
            <Route path="/app/reports" element={<PrivateRoute><Reports /></PrivateRoute>} />
            <Route path="/app/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
            <Route path="/app/billing" element={<PrivateRoute><Billing /></PrivateRoute>} />
            <Route path="/app/onboarding" element={<PrivateRoute><Onboarding /></PrivateRoute>} />
            <Route path="/app/setor/:id" element={<PrivateRoute><SectorDetail /></PrivateRoute>} />
            
            <Route path="/demo" element={<DemoLogin />} />
            <Route path="/questionario" element={<Questionnaire />} />
            <Route path="/questionario/:code" element={<Questionnaire />} />
            <Route path="/relatorio" element={<Report />} />
            <Route path="/test-db" element={<TestDb />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
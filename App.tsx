
import React, { ReactNode, ErrorInfo } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import Companies from './pages/Companies';
import Surveys from './pages/Surveys';
import Settings from './pages/Settings';
import Billing from './pages/Billing';
import Onboarding from './pages/Onboarding';
import SectorDetail from './pages/SectorDetail';
import Questionnaire from './pages/Questionnaire';
import Report from './pages/Report';
import Reports from './pages/Reports';
import DemoLogin from './pages/DemoLogin';
import TestDb from './pages/TestDb';
import { PaymentSuccess, PaymentCancel } from './pages/PaymentResult';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

interface EBProps {
  children?: ReactNode;
}

interface EBState {
  hasError: boolean;
  error?: Error;
}

// Fix: Use React.Component explicitly and define property types to ensure 'state' and 'props' are correctly recognized by TypeScript
class ErrorBoundary extends React.Component<EBProps, EBState> {
  // Explicitly defining state property to resolve "Property 'state' does not exist" errors
  public override state: EBState = { hasError: false };

  constructor(props: EBProps) {
    super(props);
    // Fix: Correctly initialize state in the constructor
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): EBState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("CRITICAL UI ERROR:", error, info);
  }

  render() {
    // Fix: Accessing 'state' which is now correctly inherited and typed
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
    // Fix: Accessing 'props.children' which is now correctly inherited and typed
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
            
            {/* Rota de retorno do Stripe */}
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

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
  // Fix: Make children optional to avoid "Property 'children' is missing" error when using ErrorBoundary in JSX
  children?: ReactNode;
}

interface EBState {
  hasError: boolean;
}

// Fix: Use React.Component explicitly to ensure 'state' and 'props' properties are correctly identified by the TypeScript compiler
class ErrorBoundary extends React.Component<EBProps, EBState> {
  constructor(props: EBProps) {
    super(props);
    // Fix: Explicitly initialize state to satisfy 'Property 'state' does not exist' errors
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): EBState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("ERRO CRÍTICO NR ZEN:", error, info);
  }

  render() {
    // Fix: this.state is correctly inherited from React.Component
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center font-sans">
          <div className="bg-white p-10 rounded-2xl shadow-2xl max-w-md border-t-8 border-red-500">
            <AlertTriangle className="mx-auto text-red-500 mb-6" size={60} />
            <h1 className="text-2xl font-bold text-slate-900 mb-4">Erro de Carregamento</h1>
            <p className="text-slate-600 mb-8 text-sm leading-relaxed">
              Ocorreu um erro ao carregar os módulos da aplicação. Limpe o cache ou tente recarregar.
            </p>
            <button 
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }} 
              className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
            >
              <RefreshCcw size={18} /> Recarregar Aplicação
            </button>
          </div>
        </div>
      );
    }

    // Fix: this.props is correctly inherited from React.Component
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
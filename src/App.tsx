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
import { AlertTriangle } from 'lucide-react';

interface ErrorBoundaryProps {
  children?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

// Error Boundary Component
// Fix: Using React.Component explicitly and a constructor to ensure props/state inheritance is correctly typed.
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render(): ReactNode {
    // Accessing state and props via this.state and this.props.
    const { hasError, error } = this.state;
    const { children } = this.props;

    if (hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-xl shadow-xl max-w-md w-full border-l-4 border-red-500">
            <div className="flex items-center gap-3 mb-4 text-red-600">
              <AlertTriangle size={32} />
              <h1 className="text-xl font-bold">Algo deu errado</h1>
            </div>
            <p className="text-slate-600 mb-4">A aplicação encontrou um erro crítico de inicialização.</p>
            <div className="bg-slate-100 p-3 rounded text-xs font-mono text-slate-500 overflow-auto max-h-32 mb-6">
              {error?.message}
            </div>
            <button 
              onClick={() => {
                localStorage.clear();
                window.location.href = '/';
              }} 
              className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold hover:bg-slate-800 transition-colors"
            >
              Limpar Cache e Recarregar
            </button>
          </div>
        </div>
      );
    }

    return children;
  }
}

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500">Carregando aplicação...</div>;
  
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            
            {/* Payment Flow Routes */}
            <Route path="/payment/success" element={<PaymentSuccess />} />
            <Route path="/payment/cancel" element={<PaymentCancel />} />
            
            {/* App Routes (Protected) */}
            <Route path="/app" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/app/companies" element={<PrivateRoute><Companies /></PrivateRoute>} />
            <Route path="/app/surveys" element={<PrivateRoute><Surveys /></PrivateRoute>} />
            <Route path="/app/reports" element={<PrivateRoute><Reports /></PrivateRoute>} />
            <Route path="/app/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
            <Route path="/app/onboarding" element={<PrivateRoute><Onboarding /></PrivateRoute>} />
            <Route path="/app/setor/:id" element={<PrivateRoute><SectorDetail /></PrivateRoute>} />
            
            {/* Demo/Public Flow */}
            <Route path="/demo" element={<DemoLogin />} />
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
    </ErrorBoundary>
  );
};

export default App;
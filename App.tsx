import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Products } from './pages/Products';
import { Orders } from './pages/Orders';
import { Inbox } from './pages/Inbox';
import { ConnectedAccounts } from './pages/ConnectedAccounts';
import { Settings } from './pages/Settings';
import { Team } from './pages/Team';
import { PublishHistory } from './pages/PublishHistory';
import { Activity } from './pages/Activity';
import { Billing } from './pages/Billing'; // Updated import
import { PrivacyPolicy, TermsOfService, DataDeletion } from './pages/LegalPages';
import { authService } from './services/authService';
import { schedulerService } from './services/schedulerService';
import { queueService } from './services/queueService';
import { Language } from './types';
import { ToastProvider } from './contexts/ToastContext';

// Protected Route Wrapper with Layout
const ProtectedRoute: React.FC<{ 
  children: React.ReactNode; 
  lang: Language; 
  setLang: (l: Language) => void;
  onLogout: () => void;
  requiredRole?: 'owner' | 'manager';
}> = ({ children, lang, setLang, onLogout, requiredRole }) => {
  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  
  if (requiredRole && !authService.hasRole(requiredRole)) {
      return <Navigate to="/dashboard" replace />;
  }

  return <Layout lang={lang} setLang={setLang} onLogout={onLogout}>{children}</Layout>;
};

const AppContent: React.FC = () => {
  const [lang, setLang] = useState<Language>('en');
  const [isAuthenticated, setIsAuthenticated] = useState(authService.isAuthenticated());

  useEffect(() => {
    // Handle RTL
    if (lang === 'ar') {
      document.documentElement.dir = 'rtl';
    } else {
      document.documentElement.dir = 'ltr';
    }
    
    // Start Background Services
    schedulerService.start();
    queueService.start(); // Start Job Queue Processor
  }, [lang]);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
  };

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route 
        path="/login" 
        element={
          isAuthenticated ? <Navigate to="/dashboard" /> : <Login lang={lang} setLang={setLang} onLogin={handleLogin} />
        } 
      />
      
      {/* Public Legal Pages */}
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/terms-of-service" element={<TermsOfService />} />
      <Route path="/data-deletion" element={<DataDeletion />} />
      
      {/* Protected Routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute lang={lang} setLang={setLang} onLogout={handleLogout}>
          <Dashboard lang={lang} />
        </ProtectedRoute>
      } />
      <Route path="/products" element={
        <ProtectedRoute lang={lang} setLang={setLang} onLogout={handleLogout}>
          <Products lang={lang} />
        </ProtectedRoute>
      } />
      <Route path="/orders" element={
        <ProtectedRoute lang={lang} setLang={setLang} onLogout={handleLogout}>
          <Orders lang={lang} />
        </ProtectedRoute>
      } />
      <Route path="/inbox" element={
        <ProtectedRoute lang={lang} setLang={setLang} onLogout={handleLogout}>
          <Inbox lang={lang} />
        </ProtectedRoute>
      } />
      <Route path="/history" element={
        <ProtectedRoute lang={lang} setLang={setLang} onLogout={handleLogout}>
          <PublishHistory lang={lang} />
        </ProtectedRoute>
      } />
      
      {/* Owner Only Routes */}
      <Route path="/connected-accounts" element={
        <ProtectedRoute lang={lang} setLang={setLang} onLogout={handleLogout} requiredRole="owner">
          <ConnectedAccounts lang={lang} />
        </ProtectedRoute>
      } />
      <Route path="/team" element={
        <ProtectedRoute lang={lang} setLang={setLang} onLogout={handleLogout} requiredRole="owner">
          <Team lang={lang} />
        </ProtectedRoute>
      } />
      <Route path="/activity" element={
        <ProtectedRoute lang={lang} setLang={setLang} onLogout={handleLogout} requiredRole="owner">
          <Activity lang={lang} />
        </ProtectedRoute>
      } />
      <Route path="/delivery-settings" element={
        <ProtectedRoute lang={lang} setLang={setLang} onLogout={handleLogout} requiredRole="owner">
          <Settings lang={lang} />
        </ProtectedRoute>
      } />
      <Route path="/billing" element={
        <ProtectedRoute lang={lang} setLang={setLang} onLogout={handleLogout} requiredRole="owner">
          <Billing lang={lang} />
        </ProtectedRoute>
      } />
      
      {/* Placeholder Routes */}
      <Route path="/analytics" element={
        <ProtectedRoute lang={lang} setLang={setLang} onLogout={handleLogout}>
          <div className="text-white text-center py-20">Analytics Module (Coming Soon)</div>
        </ProtectedRoute>
      } />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <ToastProvider>
      <HashRouter>
        <AppContent />
      </HashRouter>
    </ToastProvider>
  );
};

export default App;
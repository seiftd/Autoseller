// Version: 1.2.6 - Build Trigger
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useUser, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
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
import { Billing } from './pages/Billing';
import { PrivacyPolicy, TermsOfService, DataDeletion, FacebookPermissions, SecurityPage } from './pages/LegalPages';
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
  requiredRole?: 'owner' | 'manager';
}> = ({ children, lang, setLang, requiredRole }) => {
  return (
    <>
      <SignedIn>
        <Layout lang={lang} setLang={setLang}>{children}</Layout>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
};

const AppContent: React.FC = () => {
  const [lang, setLang] = useState<Language>('en');
  const { user, isLoaded } = useUser();

  useEffect(() => {
    // Handle RTL
    if (lang === 'ar') {
      document.documentElement.dir = 'rtl';
    } else {
      document.documentElement.dir = 'ltr';
    }

    // Start Background Services
    schedulerService.start();
    queueService.start();
  }, [lang]);

  // Sync Clerk User to App Service
  useEffect(() => {
    if (isLoaded) {
      authService.syncUser(user);
    }
  }, [user, isLoaded]);

  if (!isLoaded) {
    return <div className="flex items-center justify-center min-h-screen text-white">Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route
        path="/login"
        element={
          <>
            <SignedIn><Navigate to="/dashboard" /></SignedIn>
            <SignedOut><Login lang={lang} setLang={setLang} /></SignedOut>
          </>
        }
      />

      {/* Public Legal Pages */}
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/terms" element={<TermsOfService />} />
      <Route path="/data-deletion" element={<DataDeletion />} />
      <Route path="/facebook-permissions" element={<FacebookPermissions />} />
      <Route path="/security" element={<SecurityPage />} />

      {/* Protected Routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute lang={lang} setLang={setLang}>
          <Dashboard lang={lang} />
        </ProtectedRoute>
      } />
      <Route path="/products" element={
        <ProtectedRoute lang={lang} setLang={setLang}>
          <Products lang={lang} />
        </ProtectedRoute>
      } />
      <Route path="/orders" element={
        <ProtectedRoute lang={lang} setLang={setLang}>
          <Orders lang={lang} />
        </ProtectedRoute>
      } />
      <Route path="/inbox" element={
        <ProtectedRoute lang={lang} setLang={setLang}>
          <Inbox lang={lang} />
        </ProtectedRoute>
      } />
      <Route path="/history" element={
        <ProtectedRoute lang={lang} setLang={setLang}>
          <PublishHistory lang={lang} />
        </ProtectedRoute>
      } />

      {/* Owner Only Routes - Strict Role Check can be added later */}
      <Route path="/connected-accounts" element={
        <ProtectedRoute lang={lang} setLang={setLang} requiredRole="owner">
          <ConnectedAccounts lang={lang} />
        </ProtectedRoute>
      } />
      <Route path="/team" element={
        <ProtectedRoute lang={lang} setLang={setLang} requiredRole="owner">
          <Team lang={lang} />
        </ProtectedRoute>
      } />
      <Route path="/activity" element={
        <ProtectedRoute lang={lang} setLang={setLang} requiredRole="owner">
          <Activity lang={lang} />
        </ProtectedRoute>
      } />
      <Route path="/delivery-settings" element={
        <ProtectedRoute lang={lang} setLang={setLang} requiredRole="owner">
          <Settings lang={lang} />
        </ProtectedRoute>
      } />
      <Route path="/billing" element={
        <ProtectedRoute lang={lang} setLang={setLang} requiredRole="owner">
          <Billing lang={lang} />
        </ProtectedRoute>
      } />

      {/* Placeholder Routes */}
      <Route path="/analytics" element={
        <ProtectedRoute lang={lang} setLang={setLang}>
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
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/Layout';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
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
import { Language } from './types';
import { ToastProvider } from './contexts/ToastContext';

const AppContent: React.FC = () => {
  const [lang, setLang] = useState<Language>('en');

  useEffect(() => {
    // Handle RTL
    if (lang === 'ar') {
      document.documentElement.dir = 'rtl';
    } else {
      document.documentElement.dir = 'ltr';
    }
  }, [lang]);

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login lang={lang} setLang={setLang} />} />
      <Route path="/register" element={<Register lang={lang} setLang={setLang} />} />
      <Route path="/sign-in" element={<Navigate to="/login" replace />} />
      <Route path="/sign-up" element={<Navigate to="/register" replace />} />

      {/* Public Legal Pages */}
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/terms" element={<TermsOfService />} />
      <Route path="/data-deletion" element={<DataDeletion />} />
      <Route path="/facebook-permissions" element={<FacebookPermissions />} />
      <Route path="/security" element={<SecurityPage />} />

      {/* Protected Routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Layout lang={lang} setLang={setLang}>
            <Dashboard lang={lang} />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/products" element={
        <ProtectedRoute>
          <Layout lang={lang} setLang={setLang}>
            <Products lang={lang} />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/orders" element={
        <ProtectedRoute>
          <Layout lang={lang} setLang={setLang}>
            <Orders lang={lang} />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/inbox" element={
        <ProtectedRoute>
          <Layout lang={lang} setLang={setLang}>
            <Inbox lang={lang} />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/history" element={
        <ProtectedRoute>
          <Layout lang={lang} setLang={setLang}>
            <PublishHistory lang={lang} />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/connected-accounts" element={
        <ProtectedRoute>
          <Layout lang={lang} setLang={setLang}>
            <ConnectedAccounts lang={lang} />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/team" element={
        <ProtectedRoute>
          <Layout lang={lang} setLang={setLang}>
            <Team lang={lang} />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/activity" element={
        <ProtectedRoute>
          <Layout lang={lang} setLang={setLang}>
            <Activity lang={lang} />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/delivery-settings" element={
        <ProtectedRoute>
          <Layout lang={lang} setLang={setLang}>
            <Settings lang={lang} />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/billing" element={
        <ProtectedRoute>
          <Layout lang={lang} setLang={setLang}>
            <Billing lang={lang} />
          </Layout>
        </ProtectedRoute>
      } />

      {/* Catch-all Redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <ToastProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </AuthProvider>
    </ToastProvider>
  );
};

export default App;
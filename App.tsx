import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/Layout';
import { Language } from './types';
import { ToastProvider } from './contexts/ToastContext';

// Lazy load pages for production stability and isolation
const Landing = lazy(() => import('./pages/Landing').then(m => ({ default: m.Landing })));
const Login = lazy(() => import('./pages/Login').then(m => ({ default: m.Login })));
const Register = lazy(() => import('./pages/Register').then(m => ({ default: m.Register })));
const Dashboard = lazy(() => import('./pages/Dashboard').then(m => ({ default: m.Dashboard })));
const Products = lazy(() => import('./pages/Products').then(m => ({ default: m.Products })));
const Orders = lazy(() => import('./pages/Orders').then(m => ({ default: m.Orders })));
const Inbox = lazy(() => import('./pages/Inbox').then(m => ({ default: m.Inbox })));
const ConnectedAccounts = lazy(() => import('./pages/ConnectedAccounts').then(m => ({ default: m.ConnectedAccounts })));
const Settings = lazy(() => import('./pages/Settings').then(m => ({ default: m.Settings })));
const Team = lazy(() => import('./pages/Team').then(m => ({ default: m.Team })));
const PublishHistory = lazy(() => import('./pages/PublishHistory').then(m => ({ default: m.PublishHistory })));
const Activity = lazy(() => import('./pages/Activity').then(m => ({ default: m.Activity })));
const Billing = lazy(() => import('./pages/Billing').then(m => ({ default: m.Billing })));

// Legal Pages
const Legal = lazy(() => import('./pages/LegalPages'));
const PrivacyPolicy = lazy(() => import('./pages/LegalPages').then(m => ({ default: m.PrivacyPolicy })));
const TermsOfService = lazy(() => import('./pages/LegalPages').then(m => ({ default: m.TermsOfService })));
const DataDeletion = lazy(() => import('./pages/LegalPages').then(m => ({ default: m.DataDeletion })));
const FacebookPermissions = lazy(() => import('./pages/LegalPages').then(m => ({ default: m.FacebookPermissions })));
const SecurityPage = lazy(() => import('./pages/LegalPages').then(m => ({ default: m.SecurityPage })));

const LoadingFallback = () => (
  <div className="min-h-screen bg-[#020617] flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
      <p className="text-slate-400 text-sm font-medium animate-pulse">Loading ReplyGenie...</p>
    </div>
  </div>
);

const AppContent: React.FC = () => {
  const [lang, setLang] = useState<Language>('en');

  useEffect(() => {
    if (lang === 'ar') {
      document.documentElement.dir = 'rtl';
    } else {
      document.documentElement.dir = 'ltr';
    }
  }, [lang]);

  return (
    <Suspense fallback={<LoadingFallback />}>
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

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
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

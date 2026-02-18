import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ClerkProvider } from '@clerk/clerk-react';
import { ErrorBoundary } from './components/ErrorBoundary';
import './index.css';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const renderApp = () => {
  if (!PUBLISHABLE_KEY) {
    ReactDOM.createRoot(rootElement).render(
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 text-center text-white font-inter">
        <div className="max-w-md space-y-4">
          <h1 className="text-2xl font-bold">Configuration Error</h1>
          <p className="text-slate-400">The application is missing a critical configuration key. Please check your environment variables.</p>
        </div>
      </div>
    );
    return;
  }

  ReactDOM.createRoot(rootElement).render(
    <ErrorBoundary>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
        <App />
      </ClerkProvider>
    </ErrorBoundary>
  );
};

renderApp();
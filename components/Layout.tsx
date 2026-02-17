import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useUser, useClerk } from '@clerk/clerk-react';
import { TEXTS, MENU_ITEMS } from '../constants';
import { Language } from '../types';
import { LanguageSwitcher } from './LanguageSwitcher';
import { Bot, LogOut, Menu, X } from 'lucide-react';

interface Props {
  children: React.ReactNode;
  lang: Language;
  setLang: (l: Language) => void;
}

export const Layout: React.FC<Props> = ({ children, lang, setLang }) => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const t = TEXTS;
  const { user: clerkUser } = useUser();
  const { signOut } = useClerk();

  // Simple mapping for display
  const user = clerkUser ? {
    role: 'owner', // Default
    plan: 'free'   // Default
  } : null;

  const NavContent = () => (
    <>
      <div className="flex items-center gap-3 px-6 h-16 border-b border-slate-800">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
          <Bot className="text-white w-5 h-5" />
        </div>
        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
          AutoSeller
        </span>
      </div>

      <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        {MENU_ITEMS.map((item) => {
          // Role-based Access Control for Menu
          // Simplified: Owner sees everything
          if (item.roles && user && !item.roles.includes(user.role as any)) {
            return null;
          }

          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                ${isActive
                  ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'}
              `}
            >
              <Icon size={18} className="rtl:rotate-0" />
              <span>{t[item.labelKey][lang]}</span>
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-slate-800">
        <div className="mb-4 px-2">
          <div className="text-xs text-slate-500 uppercase font-bold mb-1">{t.role[lang]}</div>
          <div className="text-sm text-white font-medium capitalize bg-slate-800/50 px-2 py-1 rounded inline-block">
            {user?.role === 'owner' ? t.owner[lang] : t.manager[lang]}
          </div>
        </div>
        <button
          onClick={() => signOut()}
          className="flex items-center gap-3 w-full px-3 py-2.5 text-slate-400 hover:text-red-400 transition-colors rounded-xl hover:bg-red-500/5"
        >
          <LogOut size={18} className="rtl:rotate-180" />
          {t.logout[lang]}
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#020617] flex" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex w-64 flex-col border-r rtl:border-r-0 rtl:border-l border-slate-800 bg-slate-900/50 backdrop-blur-xl fixed h-full z-20 ltr:left-0 rtl:right-0">
        <NavContent />
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 w-full z-30 bg-slate-900/90 backdrop-blur-lg border-b border-slate-800 px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
            <Bot className="text-white w-5 h-5" />
          </div>
          <span className="text-lg font-bold text-white">AutoSeller</span>
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-white p-2">
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-20 bg-slate-900 pt-16 md:hidden flex flex-col">
          <NavContent />
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 ltr:md:ml-64 rtl:md:mr-64 p-4 md:p-8 pt-20 md:pt-8 overflow-x-hidden flex flex-col min-h-screen">
        <div className="max-w-6xl mx-auto w-full flex-1">
          <div className="flex justify-between items-center mb-6">
            <div className="text-white font-medium">Hello, {clerkUser?.fullName || 'User'}</div>
            <LanguageSwitcher current={lang} onChange={setLang} />
          </div>
          {children}
        </div>

        {/* Dashboard Footer for Legal Links */}
        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-wrap gap-4 justify-center md:justify-end text-xs text-slate-500">
          <Link to="/privacy-policy" className="hover:text-blue-400 transition-colors">Privacy Policy</Link>
          <span>•</span>
          <Link to="/terms-of-service" className="hover:text-blue-400 transition-colors">Terms of Service</Link>
          <span>•</span>
          <Link to="/data-deletion" className="hover:text-blue-400 transition-colors">Data Deletion</Link>
        </div>
      </main>
    </div>
  );
};
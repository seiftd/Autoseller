import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { TEXTS, MENU_ITEMS } from '../constants';
import { Language } from '../types';
import { LanguageSwitcher } from './LanguageSwitcher';
import { Bot, LogOut, Menu, X } from 'lucide-react';
import { authService } from '../services/authService';

interface Props {
  children: React.ReactNode;
  lang: Language;
  setLang: (l: Language) => void;
  onLogout: () => void;
}

export const Layout: React.FC<Props> = ({ children, lang, setLang, onLogout }) => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const t = TEXTS;

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
              <Icon size={18} />
              {t[item.labelKey][lang]}
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-slate-800">
        <button
          onClick={onLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 text-slate-400 hover:text-red-400 transition-colors rounded-xl hover:bg-red-500/5"
        >
          <LogOut size={18} />
          {t.logout[lang]}
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#020617] flex">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex w-64 flex-col border-r border-slate-800 bg-slate-900/50 backdrop-blur-xl fixed h-full z-20">
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
      <main className="flex-1 md:ml-64 p-4 md:p-8 pt-20 md:pt-8 overflow-x-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-end mb-6">
             <LanguageSwitcher current={lang} onChange={setLang} />
          </div>
          {children}
        </div>
      </main>
    </div>
  );
};
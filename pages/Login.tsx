import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { TEXTS } from '../constants';
import { Language } from '../types';
import { Lock, Sparkles } from 'lucide-react';
import { LanguageSwitcher } from '../components/LanguageSwitcher';

interface Props {
  lang: Language;
  setLang: (l: Language) => void;
  onLogin: () => void;
}

export const Login: React.FC<Props> = ({ lang, setLang, onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const t = TEXTS;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = authService.login(username, password);
    if (success) {
      onLogin();
      navigate('/dashboard');
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 relative">
      <div className="absolute top-6 right-6">
        <LanguageSwitcher current={lang} onChange={setLang} />
      </div>

      <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-8 rounded-3xl shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-4 shadow-lg shadow-blue-500/20">
            <Sparkles className="text-white w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-white">{t.loginTitle[lang]}</h2>
          <p className="text-slate-400 text-sm mt-2">Enter your secure credentials</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">{t.username[lang]}</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="admin"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">{t.password[lang]}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg text-center">
              Invalid credentials. Try admin / password.
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-900/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <Lock size={18} />
            {t.loginBtn[lang]}
          </button>
        </form>
      </div>
    </div>
  );
};
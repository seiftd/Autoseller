import React from 'react';
import { Language } from '../types';

interface Props {
  current: Language;
  onChange: (lang: Language) => void;
}

export const LanguageSwitcher: React.FC<Props> = ({ current, onChange }) => {
  return (
    <div className="flex bg-slate-800/50 rounded-lg p-1 border border-slate-700">
      {(['en', 'fr', 'ar'] as Language[]).map((lang) => (
        <button
          key={lang}
          onClick={() => onChange(lang)}
          className={`
            px-3 py-1 text-xs font-medium rounded-md transition-all uppercase
            ${current === lang 
              ? 'bg-accent text-white shadow-lg' 
              : 'text-slate-400 hover:text-white hover:bg-slate-700'}
          `}
        >
          {lang}
        </button>
      ))}
    </div>
  );
};
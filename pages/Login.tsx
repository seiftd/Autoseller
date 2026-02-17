import React from 'react';
import { SignIn } from '@clerk/clerk-react';
import { Language } from '../types';
import { LanguageSwitcher } from '../components/LanguageSwitcher';

interface Props {
  lang: Language;
  setLang: (l: Language) => void;
  onLogin?: () => void; // Optional for compatibility
}

export const Login: React.FC<Props> = ({ lang, setLang }) => {
  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 relative">
      <div className="absolute top-6 right-6">
        <LanguageSwitcher current={lang} onChange={setLang} />
      </div>
      <SignIn />
    </div>
  );
};
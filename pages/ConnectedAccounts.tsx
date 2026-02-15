import React, { useState, useEffect } from 'react';
import { storageService } from '../services/storageService';
import { SocialAccount, Language } from '../types';
import { TEXTS } from '../constants';
import { Facebook, Instagram, MessageCircle, RefreshCw, CheckCircle, XCircle } from 'lucide-react';

interface Props {
  lang: Language;
}

export const ConnectedAccounts: React.FC<Props> = ({ lang }) => {
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const t = TEXTS;

  useEffect(() => {
    setAccounts(storageService.getAccounts());
  }, []);

  const handleToggle = (id: string) => {
    storageService.toggleAccount(id);
    setAccounts(storageService.getAccounts());
  };

  const getIcon = (platform: string) => {
    switch(platform) {
        case 'Facebook': return <Facebook className="text-[#1877F2]" size={24} />;
        case 'Instagram': return <Instagram className="text-[#E4405F]" size={24} />;
        case 'WhatsApp': return <MessageCircle className="text-[#25D366]" size={24} />;
        default: return <RefreshCw size={24} />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold text-white mb-8">{t.connectedAccounts[lang]}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.map((account) => (
          <div key={account.id} className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 relative overflow-hidden">
             {account.connected && (
                 <div className="absolute top-0 right-0 p-2">
                     <div className="bg-green-500/10 text-green-400 text-xs px-2 py-1 rounded-full border border-green-500/20 flex items-center gap-1">
                         <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                         Active
                     </div>
                 </div>
             )}
             
             <div className="flex flex-col items-center text-center space-y-4 pt-4">
                <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center border border-slate-700 shadow-lg">
                    {getIcon(account.platform)}
                </div>
                <div>
                    <h3 className="text-lg font-bold text-white">{account.name}</h3>
                    <p className="text-sm text-slate-400">{account.platform}</p>
                </div>
                
                <div className="w-full pt-4 border-t border-slate-700/50">
                    <button 
                        onClick={() => handleToggle(account.id)}
                        className={`
                            w-full py-2.5 rounded-xl font-medium transition-all flex items-center justify-center gap-2
                            ${account.connected 
                                ? 'bg-slate-700 hover:bg-red-500/20 hover:text-red-400 text-slate-300' 
                                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20'}
                        `}
                    >
                        {account.connected ? (
                            <>
                                <XCircle size={18} />
                                {t.disconnectBtn[lang]}
                            </>
                        ) : (
                            <>
                                <CheckCircle size={18} />
                                {t.connectBtn[lang]}
                            </>
                        )}
                    </button>
                </div>
                
                {account.connected && (
                    <p className="text-xs text-slate-500">
                        Last synced: {new Date(account.lastSync).toLocaleTimeString()}
                    </p>
                )}
             </div>
          </div>
        ))}

        {/* Add New Placeholder */}
        <div className="border border-dashed border-slate-700 rounded-2xl p-6 flex flex-col items-center justify-center text-slate-500 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all cursor-pointer group">
            <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <RefreshCw size={24} className="text-slate-400" />
            </div>
            <p className="font-medium">Connect New Account</p>
        </div>
      </div>

      <div className="mt-8 p-6 bg-blue-900/10 border border-blue-900/30 rounded-2xl">
          <h3 className="text-blue-200 font-semibold mb-2">Why connect?</h3>
          <p className="text-blue-200/60 text-sm max-w-2xl">
              Connecting your accounts allows AutoSeller to automatically publish your new products as posts and listen to comments and DMs to provide instant AI-powered replies. We use official Meta APIs for security.
          </p>
      </div>
    </div>
  );
};
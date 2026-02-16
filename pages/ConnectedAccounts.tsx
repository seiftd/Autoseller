import React, { useState, useEffect } from 'react';
import { storageService } from '../services/storageService';
import { facebookService } from '../services/facebookService';
import { webhookService } from '../services/webhookService';
import { SocialAccount, Language } from '../types';
import { TEXTS } from '../constants';
import { Facebook, Instagram, RefreshCw, XCircle, Settings, Key, AlertTriangle, Zap, ShieldCheck, Check, ChevronDown, ChevronUp } from 'lucide-react';

interface Props {
  lang: Language;
}

export const ConnectedAccounts: React.FC<Props> = ({ lang }) => {
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [fbAppId, setFbAppId] = useState('');
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [loading, setLoading] = useState(false);
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  const t = TEXTS;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setAccounts(storageService.getAccounts());
    const storedId = localStorage.getItem('fb_app_id');
    if (storedId) setFbAppId(storedId);
  };

  const handleSaveConfig = async () => {
      if (!fbAppId) return;
      localStorage.setItem('fb_app_id', fbAppId);
      await facebookService.init(fbAppId);
      setIsConfiguring(false);
      alert("Facebook SDK Initialized!");
  };

  const handleConnectFacebook = async () => {
    if (!fbAppId) {
        alert("Please configure Facebook App ID first.");
        setIsConfiguring(true);
        return;
    }

    try {
        setLoading(true);
        if (!facebookService.isInitialized) await facebookService.init(fbAppId);
        const userToken = await facebookService.login();
        const newAccounts = await facebookService.getAccounts(userToken);
        
        if (newAccounts.length === 0) {
            alert("No Facebook Pages found. Please create a Page first.");
        } else {
            const current = storageService.getAccounts().filter(a => a.platform !== 'Facebook' && a.platform !== 'Instagram');
            const updated = [...current, ...newAccounts];
            localStorage.setItem('autoseller_accounts', JSON.stringify(updated));
            setAccounts(updated);
            alert(`Successfully connected ${newAccounts.length} accounts!`);
        }
    } catch (error) {
        console.error(error);
        alert(`Connection Failed: ${error}`);
    } finally {
        setLoading(false);
    }
  };

  const handleDisconnect = (id: string) => {
      if (!confirm("Disconnect this account?")) return;
      const updated = accounts.filter(a => a.id !== id);
      localStorage.setItem('autoseller_accounts', JSON.stringify(updated));
      setAccounts(updated);
  };

  const handleSimulateWebhook = (pageId: string) => {
      webhookService.simulateTestComment(pageId);
  };

  const getIcon = (platform: string) => {
    switch(platform) {
        case 'Facebook': return <Facebook className="text-[#1877F2]" size={24} />;
        case 'Instagram': return <Instagram className="text-[#E4405F]" size={24} />;
        default: return <RefreshCw size={24} />;
    }
  };

  const steps = [
      {
          title: "Create Facebook Developer App",
          content: "Go to developers.facebook.com, create a new app, and select 'Business' as the app type."
      },
      {
          title: "Add Facebook Login for Business",
          content: "In your app dashboard, add 'Facebook Login for Business' product and configure the settings."
      },
      {
          title: "Add Required Permissions",
          content: "Request the following permissions: pages_manage_posts, pages_read_engagement, pages_manage_metadata, pages_messaging, instagram_basic, instagram_manage_messages."
      },
      {
          title: "Connect Your Facebook Page",
          content: "Use the 'Connect' button above to authorize your Facebook Page."
      },
      {
          title: "Link Instagram Business Account",
          content: "Ensure your Instagram account is switched to 'Business' and linked to your Facebook Page in Page Settings."
      }
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">{t.connectedAccounts[lang]}</h1>
        <button 
            onClick={() => setIsConfiguring(!isConfiguring)}
            className="flex items-center gap-2 text-slate-400 hover:text-white bg-slate-800 px-4 py-2 rounded-xl"
        >
            <Settings size={18} /> Configure App ID
        </button>
      </div>

      {/* Configuration Panel */}
      {isConfiguring && (
          <div className="bg-slate-800/80 border border-slate-700 p-6 rounded-2xl animate-fade-in-up">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Key className="text-yellow-400" /> Facebook App Configuration
              </h3>
              <p className="text-sm text-slate-400 mb-4">
                  To connect real accounts, you need a Facebook App ID.
              </p>
              <div className="flex gap-4">
                  <input 
                    type="text" 
                    placeholder="Enter Facebook App ID" 
                    value={fbAppId}
                    onChange={e => setFbAppId(e.target.value)}
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-white"
                  />
                  <button 
                    onClick={handleSaveConfig}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-xl font-bold"
                  >
                      Save & Init SDK
                  </button>
              </div>
          </div>
      )}

      {/* Warning if no App ID */}
      {!fbAppId && !isConfiguring && (
          <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-xl flex items-center gap-3 text-yellow-200">
              <AlertTriangle />
              <p>Facebook integration is in Demo Mode. Configure App ID to enable real connections.</p>
          </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.map((account) => (
          <div key={account.id} className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 relative overflow-hidden group">
             {account.connected && (
                 <div className="absolute top-0 right-0 p-2">
                     <div className="bg-green-500/10 text-green-400 text-xs px-2 py-1 rounded-full border border-green-500/20 flex items-center gap-1">
                         <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                         Active
                     </div>
                 </div>
             )}
             
             <div className="flex flex-col items-center text-center space-y-4 pt-4">
                <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center border border-slate-700 shadow-lg relative">
                    {account.avatarUrl ? (
                        <img src={account.avatarUrl} alt={account.name} className="w-full h-full rounded-full object-cover" />
                    ) : (
                        getIcon(account.platform)
                    )}
                </div>
                <div>
                    <h3 className="text-lg font-bold text-white">{account.name}</h3>
                    <p className="text-sm text-slate-400">{account.platform}</p>
                    {account.pageId && <p className="text-xs text-slate-600 font-mono mt-1">ID: {account.pageId}</p>}
                </div>
                
                <div className="w-full pt-4 border-t border-slate-700/50 space-y-2">
                    <button
                        onClick={() => handleSimulateWebhook(account.pageId || '')}
                        className="w-full py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs font-medium flex items-center justify-center gap-2"
                    >
                        <Zap size={14} /> Test Auto-Reply
                    </button>

                    <button 
                        onClick={() => handleDisconnect(account.id)}
                        className="w-full py-2.5 rounded-xl font-medium transition-all flex items-center justify-center gap-2 bg-slate-900 hover:bg-red-500/20 hover:text-red-400 text-slate-300 border border-slate-700"
                    >
                        <XCircle size={18} />
                        {t.disconnectBtn[lang]}
                    </button>
                </div>
             </div>
          </div>
        ))}

        {/* Connect New Button */}
        <div 
            onClick={handleConnectFacebook}
            className={`
                border border-dashed border-slate-700 rounded-2xl p-6 flex flex-col items-center justify-center text-slate-500 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all cursor-pointer group
                ${loading ? 'opacity-50 pointer-events-none' : ''}
            `}
        >
            {loading ? (
                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-3" />
            ) : (
                <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Facebook size={24} className="text-blue-500" />
                </div>
            )}
            <p className="font-medium">{loading ? 'Connecting...' : 'Connect Facebook / Instagram'}</p>
            <p className="text-xs text-slate-600 mt-1">Requires Pop-up</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
        {/* Connection Guide */}
        <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-white mb-6">How to Connect Your Business Accounts</h2>
            <div className="space-y-4">
                {steps.map((step, idx) => (
                    <div key={idx} className="bg-slate-800/30 border border-slate-700 rounded-xl overflow-hidden">
                        <button 
                            onClick={() => setExpandedStep(expandedStep === idx ? null : idx)}
                            className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-700/30 transition"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${expandedStep === idx ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-400'}`}>
                                    {idx + 1}
                                </div>
                                <span className={`font-medium ${expandedStep === idx ? 'text-white' : 'text-slate-300'}`}>{step.title}</span>
                            </div>
                            {expandedStep === idx ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
                        </button>
                        {expandedStep === idx && (
                            <div className="p-4 pt-0 pl-16 text-slate-400 text-sm leading-relaxed border-t border-slate-700/50 bg-slate-900/20">
                                {step.content}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>

        {/* Permission Transparency */}
        <div className="lg:col-span-1">
             <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 p-6 rounded-2xl sticky top-24">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                        <ShieldCheck className="text-green-400" size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-white">Permission Transparency</h3>
                        <p className="text-xs text-green-400 font-medium">100% Secure & Compliant</p>
                    </div>
                </div>
                
                <p className="text-sm text-slate-300 mb-4">ReplyGenie only requests permissions necessary to automate your business:</p>
                
                <ul className="space-y-3 mb-6">
                    {['Publish & Edit Posts', 'Reply to Comments', 'Send Direct Messages'].map((perm, i) => (
                        <li key={i} className="flex items-center gap-3 text-sm text-slate-400">
                            <Check size={16} className="text-blue-500" />
                            {perm}
                        </li>
                    ))}
                </ul>

                <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 text-xs text-slate-500 space-y-2">
                    <p className="flex items-center gap-2 text-slate-400">
                        <XCircle size={14} className="text-red-400" /> We do NOT access personal profiles
                    </p>
                    <p className="flex items-center gap-2 text-slate-400">
                        <XCircle size={14} className="text-red-400" /> We do NOT read private messages unrelated to business
                    </p>
                </div>
             </div>
        </div>
      </div>
    </div>
  );
};
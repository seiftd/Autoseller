import React, { useState, useEffect } from 'react';
import { storageService } from '../services/storageService';
import { facebookService } from '../services/facebookService';
import { webhookService } from '../services/webhookService';
import { SocialAccount, Language } from '../types';
import { TEXTS } from '../constants';
import { Facebook, Instagram, RefreshCw, XCircle, Settings, Key, AlertTriangle, Zap, ShieldCheck, Check, ChevronDown, ChevronUp, Share2 } from 'lucide-react';
import { EmptyState, Spinner, Badge, SectionHeader } from '../components/PremiumUI';
import { useToast } from '../contexts/ToastContext';

interface Props {
  lang: Language;
}

export const ConnectedAccounts: React.FC<Props> = ({ lang }) => {
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [fbAppId, setFbAppId] = useState('');
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [loading, setLoading] = useState(false);
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  const { showToast } = useToast();
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
      showToast("Facebook SDK Initialized successfully!", "success");
  };

  const handleConnectFacebook = async () => {
    if (!fbAppId) {
        showToast("Please configure Facebook App ID first.", "warning");
        setIsConfiguring(true);
        return;
    }

    try {
        setLoading(true);
        if (!facebookService.isInitialized) await facebookService.init(fbAppId);
        const userToken = await facebookService.login();
        const newAccounts = await facebookService.getAccounts(userToken);
        
        if (newAccounts.length === 0) {
            showToast("No Facebook Pages found. Please create a Page first.", "warning");
        } else {
            const current = storageService.getAccounts().filter(a => a.platform !== 'Facebook' && a.platform !== 'Instagram');
            const updated = [...current, ...newAccounts];
            localStorage.setItem('autoseller_accounts', JSON.stringify(updated));
            setAccounts(updated);
            showToast(`Successfully connected ${newAccounts.length} accounts!`, "success");
        }
    } catch (error) {
        console.error(error);
        showToast(`Connection Failed: ${error}`, "error");
    } finally {
        setLoading(false);
    }
  };

  const handleDisconnect = (id: string) => {
      if (!confirm("Disconnect this account?")) return;
      const updated = accounts.filter(a => a.id !== id);
      localStorage.setItem('autoseller_accounts', JSON.stringify(updated));
      setAccounts(updated);
      showToast("Account disconnected.", "info");
  };

  const handleSimulateWebhook = (pageId: string) => {
      webhookService.simulateTestComment(pageId);
      showToast("Test webhook triggered. Check Dashboard health.", "info");
  };

  const getIcon = (platform: string) => {
    switch(platform) {
        case 'Facebook': return <Facebook className="text-[#1877F2]" size={32} />;
        case 'Instagram': return <Instagram className="text-[#E4405F]" size={32} />;
        default: return <RefreshCw size={32} />;
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
    <div className="space-y-8 animate-fade-in pb-12">
      <SectionHeader 
        title={t.connectedAccounts[lang]}
        subtitle="Manage your social media integrations"
        action={
            <button 
                onClick={() => setIsConfiguring(!isConfiguring)}
                className="flex items-center gap-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-xl transition-colors font-medium border border-slate-700"
            >
                <Settings size={18} /> Configure App ID
            </button>
        }
      />

      {/* Configuration Panel */}
      {isConfiguring && (
          <div className="bg-slate-800/80 border border-slate-700 p-6 rounded-2xl animate-fade-in-up shadow-xl">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Key className="text-yellow-400" /> Facebook App Configuration
              </h3>
              <p className="text-sm text-slate-400 mb-6 max-w-2xl">
                  To connect real accounts, you need a Facebook App ID from the Meta Developer Portal.
                  This ensures secure API access to your business pages.
              </p>
              <div className="flex gap-4 max-w-xl">
                  <input 
                    type="text" 
                    placeholder="Enter Facebook App ID" 
                    value={fbAppId}
                    onChange={e => setFbAppId(e.target.value)}
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none"
                  />
                  <button 
                    onClick={handleSaveConfig}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-xl font-bold shadow-lg"
                  >
                      Save
                  </button>
              </div>
          </div>
      )}

      {/* Warning if no App ID */}
      {!fbAppId && !isConfiguring && (
          <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-xl flex items-center gap-3 text-yellow-200">
              <AlertTriangle />
              <p className="font-medium">Facebook integration is in Demo Mode. Configure App ID to enable real connections.</p>
          </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Account Cards */}
        {accounts.map((account) => (
          <div key={account.id} className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 relative overflow-hidden group hover:border-blue-500/50 transition-all">
             <div className="absolute top-4 right-4">
                <Badge variant={account.connected ? 'success' : 'error'}>
                   {account.connected ? 'Active' : 'Disconnected'}
                </Badge>
             </div>
             
             <div className="flex flex-col items-center text-center space-y-4 pt-4">
                <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center border-2 border-slate-700 shadow-xl relative group-hover:scale-110 transition-transform duration-300">
                    {account.avatarUrl ? (
                        <img src={account.avatarUrl} alt={account.name} className="w-full h-full rounded-full object-cover" />
                    ) : (
                        getIcon(account.platform)
                    )}
                    {/* Platform Badge */}
                    <div className="absolute -bottom-1 -right-1 bg-slate-900 rounded-full p-1 border border-slate-700">
                        {account.platform === 'Facebook' ? <Facebook size={14} className="text-blue-500"/> : <Instagram size={14} className="text-pink-500"/>}
                    </div>
                </div>
                <div>
                    <h3 className="text-lg font-bold text-white">{account.name}</h3>
                    {account.pageId && <p className="text-xs text-slate-500 font-mono mt-1 bg-slate-900/50 px-2 py-0.5 rounded-md inline-block">ID: {account.pageId}</p>}
                </div>
                
                <div className="w-full pt-4 border-t border-slate-700/50 space-y-2">
                    <button
                        onClick={() => handleSimulateWebhook(account.pageId || '')}
                        className="w-full py-2.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                    >
                        <Zap size={14} /> Test Auto-Reply
                    </button>

                    <button 
                        onClick={() => handleDisconnect(account.id)}
                        className="w-full py-2.5 rounded-xl font-medium transition-all flex items-center justify-center gap-2 text-xs bg-slate-900 hover:bg-red-500/10 hover:text-red-400 text-slate-400 border border-slate-700"
                    >
                        <XCircle size={14} />
                        Disconnect
                    </button>
                </div>
             </div>
          </div>
        ))}

        {/* Connect New Button */}
        <div 
            onClick={handleConnectFacebook}
            className={`
                border-2 border-dashed border-slate-700 rounded-2xl p-6 flex flex-col items-center justify-center text-slate-500 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all cursor-pointer group min-h-[300px]
                ${loading ? 'opacity-50 pointer-events-none' : ''}
            `}
        >
            {loading ? (
                <Spinner size="lg" className="text-blue-500 mb-4" />
            ) : (
                <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-inner">
                    <Share2 size={32} className="text-blue-500" />
                </div>
            )}
            <p className="font-bold text-lg text-slate-300">{loading ? 'Connecting...' : 'Connect New Account'}</p>
            <p className="text-xs text-slate-500 mt-2 max-w-[200px] text-center">Add Facebook Page or Instagram Business Account</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
        {/* Connection Guide */}
        <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <ShieldCheck className="text-emerald-500" /> Setup Guide
            </h2>
            <div className="space-y-4">
                {steps.map((step, idx) => (
                    <div key={idx} className="bg-slate-800/30 border border-slate-700/50 rounded-xl overflow-hidden hover:border-blue-500/30 transition-colors">
                        <button 
                            onClick={() => setExpandedStep(expandedStep === idx ? null : idx)}
                            className="w-full flex items-center justify-between p-4 text-left"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-sm ${expandedStep === idx ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-400'}`}>
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
             <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 p-6 rounded-2xl sticky top-24 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                        <ShieldCheck className="text-green-400" size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-white">Data Privacy</h3>
                        <p className="text-xs text-green-400 font-medium bg-green-900/30 px-2 py-0.5 rounded-full inline-block mt-1">100% Compliant</p>
                    </div>
                </div>
                
                <p className="text-sm text-slate-300 mb-6 leading-relaxed">ReplyGenie only requests permissions necessary to automate your business:</p>
                
                <ul className="space-y-4 mb-8">
                    {[
                        { text: 'Publish & Edit Posts', desc: 'To upload products automatically' },
                        { text: 'Reply to Comments', desc: 'To answer customer pricing questions' },
                        { text: 'Send Direct Messages', desc: 'To take orders privately' }
                    ].map((perm, i) => (
                        <li key={i} className="flex gap-3 text-sm">
                            <div className="mt-0.5"><Check size={16} className="text-blue-500" /></div>
                            <div>
                                <span className="text-slate-200 font-medium block">{perm.text}</span>
                                <span className="text-slate-500 text-xs">{perm.desc}</span>
                            </div>
                        </li>
                    ))}
                </ul>

                <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 text-xs text-slate-500 space-y-2">
                    <p className="flex items-center gap-2 text-slate-400">
                        <XCircle size={14} className="text-red-400" /> We do NOT access personal profiles
                    </p>
                    <p className="flex items-center gap-2 text-slate-400">
                        <XCircle size={14} className="text-red-400" /> We do NOT read private personal chats
                    </p>
                </div>
             </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { storageService } from '../services/storageService';
import { facebookService } from '../services/facebookService';
import { webhookService } from '../services/webhookService';
import { SocialAccount, Language, FacebookConfig } from '../types';
import { TEXTS } from '../constants';
import { Facebook, Instagram, MessageCircle, RefreshCw, CheckCircle, XCircle, Settings, Key, AlertTriangle, Zap } from 'lucide-react';

interface Props {
  lang: Language;
}

export const ConnectedAccounts: React.FC<Props> = ({ lang }) => {
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [fbAppId, setFbAppId] = useState('');
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [loading, setLoading] = useState(false);
  const t = TEXTS;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setAccounts(storageService.getAccounts());
    // Load config from storage if exists (simulated)
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
        // Ensure initialized
        if (!facebookService.isInitialized) await facebookService.init(fbAppId);
        
        // Login
        const userToken = await facebookService.login();
        
        // Fetch Pages
        const newAccounts = await facebookService.getAccounts(userToken);
        
        if (newAccounts.length === 0) {
            alert("No Facebook Pages found. Please create a Page first.");
        } else {
            // Merge with existing accounts (WhatsApp etc)
            const current = storageService.getAccounts().filter(a => a.platform === 'WhatsApp'); // Keep WA
            const updated = [...current, ...newAccounts];
            
            // Save
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
        case 'WhatsApp': return <MessageCircle className="text-[#25D366]" size={24} />;
        default: return <RefreshCw size={24} />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
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
                  To connect real accounts, you need a Facebook App with <strong>Facebook Login for Business</strong> added.
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
                    {account.platform !== 'WhatsApp' && (
                        <button
                            onClick={() => handleSimulateWebhook(account.pageId || '')}
                            className="w-full py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs font-medium flex items-center justify-center gap-2"
                        >
                            <Zap size={14} /> Test Auto-Reply
                        </button>
                    )}

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

      <div className="mt-8 p-6 bg-blue-900/10 border border-blue-900/30 rounded-2xl">
          <h3 className="text-blue-200 font-semibold mb-2">Real Integration Guide</h3>
          <ul className="list-disc list-inside text-blue-200/60 text-sm space-y-2">
              <li>Enter your Facebook App ID in the settings above.</li>
              <li>Your Facebook Account must be an Admin of the App (if in Development mode).</li>
              <li>Click "Connect" to grant permissions for Pages and Instagram.</li>
              <li>Once connected, creating a product with "Auto-Publish" will post to your real pages.</li>
              <li>Use "Test Auto-Reply" to simulate how the bot would respond to a comment on that page.</li>
          </ul>
      </div>
    </div>
  );
};
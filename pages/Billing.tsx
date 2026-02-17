import React, { useState, useEffect } from 'react';
import { billingService, AVAILABLE_ADDONS } from '../services/billingService';
import { storageService } from '../services/storageService';
import { authService } from '../services/authService';
import { User, UserAddOn, Language } from '../types';
import { TEXTS } from '../constants';
import { SectionHeader, Badge } from '../components/PremiumUI';
import { CreditCard, CheckCircle2, Zap, Shield, Plus, X, Crown, TrendingUp, Calendar } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';

interface Props {
  lang: Language;
}

export const Billing: React.FC<Props> = ({ lang }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userAddons, setUserAddons] = useState<UserAddOn[]>([]);
  const [bill, setBill] = useState({ base: 0, addons: 0, total: 0 });
  const { showToast } = useToast();
  const t = TEXTS;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const u = authService.getCurrentUser();
    setUser(u);
    setUserAddons(storageService.getUserAddons());
    setBill(billingService.getCurrentBill());
  };

  const handleToggleAddon = (addonId: string, active: boolean) => {
      // Simulate API delay
      setTimeout(() => {
          storageService.toggleAddon(addonId, active);
          loadData(); // Refresh state
          showToast(active ? "Add-on activated" : "Add-on deactivated", active ? "success" : "info");
      }, 300);
  };

  if (!user) return null;

  const isBusiness = user.plan === 'business';

  return (
    <div className="space-y-8 animate-fade-in pb-12">
        <SectionHeader title={t.billing[lang]} />

        {/* Current Plan Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 p-8 rounded-3xl relative overflow-hidden">
                <div className="relative z-10 flex flex-col h-full justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <h2 className="text-2xl font-bold text-white">Current Plan</h2>
                            <Badge variant={isBusiness ? 'warning' : 'info'} className="text-sm px-3 py-1">
                                {user.plan.toUpperCase()}
                            </Badge>
                        </div>
                        <div className="text-4xl font-bold text-white mb-2">
                            ${bill.total}<span className="text-lg text-slate-400 font-medium">/mo</span>
                        </div>
                        <div className="text-sm text-slate-400 flex items-center gap-2">
                            <Calendar size={14} /> Renews on Nov 24, 2024
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-700/50">
                        <div className="flex justify-between items-center text-sm mb-2">
                            <span className="text-slate-400">Base Plan ({user.plan})</span>
                            <span className="text-white font-mono">${bill.base}.00</span>
                        </div>
                        {!isBusiness && bill.addons > 0 && (
                            <div className="flex justify-between items-center text-sm mb-2">
                                <span className="text-slate-400">Active Add-ons</span>
                                <span className="text-white font-mono">+${bill.addons}.00</span>
                            </div>
                        )}
                        <div className="flex justify-between items-center text-sm font-bold pt-2 border-t border-slate-700/50 mt-2">
                            <span className="text-white">Total</span>
                            <span className="text-green-400 font-mono">${bill.total}.00</span>
                        </div>
                    </div>
                </div>
                
                {/* Decorative BG */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none"></div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-3xl flex flex-col justify-center gap-4">
                <button className="w-full py-3 bg-white text-slate-900 rounded-xl font-bold hover:bg-slate-200 transition-colors flex items-center justify-center gap-2">
                    <TrendingUp size={18} /> Upgrade Plan
                </button>
                <button className="w-full py-3 bg-slate-900 text-slate-300 border border-slate-700 rounded-xl font-bold hover:text-white hover:border-slate-600 transition-colors">
                    Manage Payment Method
                </button>
                <p className="text-xs text-center text-slate-500 mt-2">Secure payment via Stripe</p>
            </div>
        </div>

        {/* Add-on Marketplace (Only for Non-Business) */}
        {!isBusiness ? (
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
                        <Zap size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">Add-on Marketplace</h2>
                        <p className="text-sm text-slate-400">Customize your plan with specific features.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {AVAILABLE_ADDONS.map(addon => {
                        const isActive = userAddons.some(ua => ua.addonId === addon.id);
                        return (
                            <div key={addon.id} className={`p-6 rounded-2xl border transition-all duration-300 ${isActive ? 'bg-blue-900/10 border-blue-500/50 shadow-lg shadow-blue-900/10' : 'bg-slate-800/30 border-slate-700 hover:border-slate-600'}`}>
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="font-bold text-white">{addon.name}</h3>
                                    <span className="text-sm font-bold text-slate-300 bg-slate-900 px-2 py-1 rounded-lg border border-slate-700">
                                        ${addon.priceMonthly}/mo
                                    </span>
                                </div>
                                <p className="text-sm text-slate-400 mb-6 min-h-[40px]">{addon.description}</p>
                                
                                <button 
                                    onClick={() => handleToggleAddon(addon.id, !isActive)}
                                    className={`w-full py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${isActive ? 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20' : 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg'}`}
                                >
                                    {isActive ? (
                                        <> <X size={16} /> Remove Add-on </>
                                    ) : (
                                        <> <Plus size={16} /> Add to Plan </>
                                    )}
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
        ) : (
            // Business Plan View (All Included)
            <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-3xl p-8 flex items-center gap-6">
                <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center text-yellow-500 shrink-0">
                    <Crown size={32} />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-white mb-2">You have the Business Plan</h3>
                    <p className="text-slate-300 mb-4 max-w-2xl">
                        Congratulations! You have access to <strong>all features</strong>, including unlimited team members, advanced analytics, recurring posts, and priority support. No add-ons required.
                    </p>
                    <div className="flex gap-4 flex-wrap">
                        {['All Add-ons Included', 'Priority Support', 'API Access'].map((feat, i) => (
                            <span key={i} className="flex items-center gap-2 text-xs font-bold text-yellow-400 bg-yellow-900/20 px-3 py-1.5 rounded-full border border-yellow-500/20">
                                <CheckCircle2 size={14} /> {feat}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};
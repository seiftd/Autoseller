import React, { useState, useEffect } from 'react';
import { storageService } from '../services/storageService';
import { DeliverySettings, Language } from '../types';
import { TEXTS, WILAYAS } from '../constants';
import { Settings as SettingsIcon, Facebook, MessageCircle, Save } from 'lucide-react';

interface Props {
  lang: Language;
}

export const Settings: React.FC<Props> = ({ lang }) => {
  const [settings, setSettings] = useState<DeliverySettings | null>(null);
  const t = TEXTS;

  useEffect(() => {
    setSettings(storageService.getSettings());
  }, []);

  if (!settings) return null;

  const handleSave = () => {
    storageService.saveSettings(settings);
    alert('Settings Saved');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <SettingsIcon className="text-accent" />
            {t.settings[lang]}
        </h1>

        {/* Integration Status */}
        <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl">
            <h2 className="text-xl font-semibold text-white mb-6">{t.connectTitle[lang]}</h2>
            <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-900 rounded-xl border border-slate-700">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#1877F2] rounded-lg flex items-center justify-center text-white">
                            <Facebook size={20} />
                        </div>
                        <div>
                            <p className="font-medium text-white">Facebook Page</p>
                            <p className="text-xs text-green-400">Connected as "My Shop"</p>
                        </div>
                    </div>
                    <button className="text-xs bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg text-white">Disconnect</button>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-900 rounded-xl border border-slate-700">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#25D366] rounded-lg flex items-center justify-center text-white">
                            <MessageCircle size={20} />
                        </div>
                        <div>
                            <p className="font-medium text-white">WhatsApp Business</p>
                            <p className="text-xs text-slate-500">Not Connected</p>
                        </div>
                    </div>
                    <button className="text-xs bg-accent hover:bg-accentHover px-3 py-1.5 rounded-lg text-white">Connect</button>
                </div>
            </div>
        </div>

        {/* Delivery Settings */}
        <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl">
            <h2 className="text-xl font-semibold text-white mb-6">{t.deliverySettings[lang]}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                    <label className="block text-sm text-slate-400 mb-2">Default Delivery Cost (DA)</label>
                    <input 
                        type="number" 
                        value={settings.defaultCost} 
                        onChange={(e) => setSettings({...settings, defaultCost: Number(e.target.value)})}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-accent outline-none" 
                    />
                </div>
                <div>
                    <label className="block text-sm text-slate-400 mb-2">{t.shippingCompany[lang]}</label>
                    <select 
                        value={settings.shippingCompany}
                        onChange={(e) => setSettings({...settings, shippingCompany: e.target.value as any})}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-accent outline-none"
                    >
                        <option value="Yalidine">Yalidine</option>
                        <option value="ZR Express">ZR Express</option>
                        <option value="EMS">EMS</option>
                        <option value="Custom">Custom</option>
                    </select>
                </div>
            </div>

            <h3 className="text-sm font-semibold text-slate-400 mb-3">Wilaya Coverage</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 h-40 overflow-y-auto p-2 border border-slate-800 rounded-xl bg-slate-900/30">
                {WILAYAS.map(w => (
                    <div key={w} className="flex items-center gap-2 text-sm text-slate-300">
                        <input type="checkbox" checked className="accent-blue-500" /> {w}
                    </div>
                ))}
            </div>

            <div className="mt-6 flex justify-end">
                <button onClick={handleSave} className="flex items-center gap-2 bg-accent hover:bg-accentHover text-white px-6 py-2.5 rounded-xl font-medium transition-all">
                    <Save size={18} />
                    Save Settings
                </button>
            </div>
        </div>
    </div>
  );
};
import React, { useState, useEffect } from 'react';
import { storageService } from '../services/storageService';
import { DeliverySettings, Language, Country } from '../types';
import { TEXTS } from '../constants';
import { Settings as SettingsIcon, Facebook, MessageCircle, Save, Globe, MapPin, Truck, Plus, Trash2 } from 'lucide-react';

interface Props {
  lang: Language;
}

export const Settings: React.FC<Props> = ({ lang }) => {
  const [activeTab, setActiveTab] = useState<'general' | 'countries'>('general');
  const [countries, setCountries] = useState<Country[]>([]);
  const t = TEXTS;

  useEffect(() => {
    setCountries(storageService.getCountries());
  }, []);

  const handleSaveCountries = () => {
    storageService.saveCountries(countries);
    alert('Country Settings Saved');
  };

  const updateCountry = (id: string, field: keyof Country, value: any) => {
      setCountries(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const addShippingCompany = (countryId: string) => {
      const company = prompt("Enter Shipping Company Name:");
      if (company) {
          setCountries(prev => prev.map(c => {
              if (c.id === countryId) {
                  return { ...c, shippingCompanies: [...c.shippingCompanies, company] };
              }
              return c;
          }));
      }
  };

  const removeShippingCompany = (countryId: string, company: string) => {
      setCountries(prev => prev.map(c => {
          if (c.id === countryId) {
              return { ...c, shippingCompanies: c.shippingCompanies.filter(sc => sc !== company) };
          }
          return c;
      }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <SettingsIcon className="text-accent" />
            {t.settings[lang]}
        </h1>

        {/* Tabs */}
        <div className="flex border-b border-slate-700 space-x-6">
            <button 
                onClick={() => setActiveTab('general')}
                className={`pb-4 px-2 font-medium transition-colors ${activeTab === 'general' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-slate-400 hover:text-white'}`}
            >
                Integrations
            </button>
            <button 
                onClick={() => setActiveTab('countries')}
                className={`pb-4 px-2 font-medium transition-colors ${activeTab === 'countries' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-slate-400 hover:text-white'}`}
            >
                {t.countrySettings[lang]}
            </button>
        </div>

        {activeTab === 'general' && (
            <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl animate-fade-in">
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
                </div>
                <div className="mt-4 p-4 bg-blue-900/10 border border-blue-900/30 rounded-xl text-sm text-blue-300">
                    To manage connections and view detailed guides, please visit the <a href="#/connected-accounts" className="underline font-bold">Connected Accounts</a> page.
                </div>
            </div>
        )}

        {activeTab === 'countries' && (
            <div className="space-y-6 animate-fade-in">
                <div className="flex justify-between items-center">
                    <p className="text-slate-400">Manage supported countries, regions, and shipping providers.</p>
                    <button onClick={handleSaveCountries} className="flex items-center gap-2 bg-accent hover:bg-accentHover text-white px-4 py-2 rounded-xl font-medium transition-all">
                        <Save size={18} />
                        Save Changes
                    </button>
                </div>

                {countries.map(country => (
                    <div key={country.id} className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl">
                        <div className="flex items-center justify-between mb-4 border-b border-slate-700 pb-4">
                            <div className="flex items-center gap-3">
                                <Globe className="text-blue-400" />
                                <h2 className="text-xl font-bold text-white">{country.name}</h2>
                                <span className="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded uppercase">{country.currency}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Shipping Companies */}
                            <div>
                                <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2"><Truck size={14}/> Shipping Providers</h3>
                                <div className="space-y-2">
                                    {country.shippingCompanies.map(sc => (
                                        <div key={sc} className="flex items-center justify-between bg-slate-900 p-2 rounded-lg border border-slate-800">
                                            <span className="text-sm text-slate-300">{sc}</span>
                                            <button onClick={() => removeShippingCompany(country.id, sc)} className="text-red-400 hover:text-red-300">
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    ))}
                                    <button 
                                        onClick={() => addShippingCompany(country.id)}
                                        className="w-full py-2 border border-dashed border-slate-600 rounded-lg text-slate-500 hover:text-blue-400 hover:border-blue-500 transition-colors text-sm flex items-center justify-center gap-2"
                                    >
                                        <Plus size={14}/> Add Provider
                                    </button>
                                </div>
                            </div>

                            {/* Regions */}
                            <div>
                                <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2"><MapPin size={14}/> Regions / States</h3>
                                <div className="h-40 overflow-y-auto bg-slate-900 rounded-lg border border-slate-800 p-2">
                                    <div className="flex flex-wrap gap-2">
                                        {country.regions.map(r => (
                                            <span key={r.id} className="text-xs bg-slate-800 text-slate-400 px-2 py-1 rounded">
                                                {r.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                <button className="w-full py-4 border-2 border-dashed border-slate-700 rounded-2xl text-slate-400 hover:text-white hover:border-slate-500 hover:bg-slate-800/30 transition-all font-medium flex items-center justify-center gap-2">
                    <Plus size={20} />
                    Add New Country (Coming Soon)
                </button>
            </div>
        )}
    </div>
  );
};
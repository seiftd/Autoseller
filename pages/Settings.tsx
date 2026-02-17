import React, { useState, useEffect } from 'react';
import { storageService } from '../services/storageService';
import { queueService } from '../services/queueService';
import { authService } from '../services/authService';
import { DeliverySettings, Language, Country, WebhookEvent, Job, ErrorLog, Session } from '../types';
import { TEXTS } from '../constants';
import { Settings as SettingsIcon, Facebook, MessageCircle, Save, Globe, MapPin, Truck, Plus, Trash2, Activity, AlertTriangle, RefreshCw, Server, ShieldCheck, Lock, Smartphone, Monitor } from 'lucide-react';
import { SectionHeader, Badge, EmptyState } from '../components/PremiumUI';
import { useToast } from '../contexts/ToastContext';

interface Props {
  lang: Language;
}

export const Settings: React.FC<Props> = ({ lang }) => {
  const [activeTab, setActiveTab] = useState<'general' | 'countries' | 'security' | 'health'>('general');
  const [countries, setCountries] = useState<Country[]>([]);
  const [webhookEvents, setWebhookEvents] = useState<WebhookEvent[]>([]);
  const [failedJobs, setFailedJobs] = useState<Job[]>([]);
  const [errorLogs, setErrorLogs] = useState<ErrorLog[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const { showToast } = useToast();
  
  const t = TEXTS;

  useEffect(() => {
    loadData();
    // Refresh health data every 5s
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadData = () => {
    setCountries(storageService.getCountries());
    setWebhookEvents(storageService.getWebhookEvents());
    setFailedJobs(storageService.getFailedJobs());
    setErrorLogs(storageService.getErrorLogs());
    setSessions(authService.getSessions());
  };

  const handleSaveCountries = () => {
    storageService.saveCountries(countries);
    showToast(t.save[lang], 'success');
  };

  const handleRetryJob = (id: string) => {
      queueService.retryFailedJob(id);
      loadData();
      showToast("Job re-queued for processing", "info");
  };

  const handleLogoutAll = async () => {
      if(confirm("Are you sure you want to log out of all other devices?")) {
          await authService.logoutAllSessions();
          showToast("Logged out from other sessions", "success");
          setSessions(prev => prev.filter(s => s.current));
      }
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
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-12">
        <SectionHeader title={t.settings[lang]} />

        {/* Tabs */}
        <div className="flex border-b border-slate-700 space-x-6 overflow-x-auto">
            <button 
                onClick={() => setActiveTab('general')}
                className={`pb-4 px-2 font-medium transition-colors whitespace-nowrap ${activeTab === 'general' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-slate-400 hover:text-white'}`}
            >
                {t.integrations[lang]}
            </button>
            <button 
                onClick={() => setActiveTab('countries')}
                className={`pb-4 px-2 font-medium transition-colors whitespace-nowrap ${activeTab === 'countries' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-slate-400 hover:text-white'}`}
            >
                {t.countrySettings[lang]}
            </button>
            <button 
                onClick={() => setActiveTab('security')}
                className={`pb-4 px-2 font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${activeTab === 'security' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-slate-400 hover:text-white'}`}
            >
                <Lock size={16} /> {t.security[lang]}
            </button>
            <button 
                onClick={() => setActiveTab('health')}
                className={`pb-4 px-2 font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${activeTab === 'health' ? 'text-emerald-500 border-b-2 border-emerald-500' : 'text-slate-400 hover:text-white'}`}
            >
                <Activity size={16} /> {t.systemHealth[lang]}
            </button>
        </div>

        {activeTab === 'general' && (
            <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl animate-fade-in">
                <h2 className="text-xl font-bold text-white mb-6">{t.connectTitle[lang]}</h2>
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
                        <button className="text-xs bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg text-white transition-colors">{t.disconnectBtn[lang]}</button>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'countries' && (
            <div className="space-y-6 animate-fade-in">
                <div className="flex justify-between items-center">
                    <p className="text-slate-400 text-sm md:text-base">Manage supported countries, regions, and shipping providers.</p>
                    <button onClick={handleSaveCountries} className="flex items-center gap-2 bg-accent hover:bg-accentHover text-white px-4 py-2 rounded-xl font-medium transition-all shadow-lg">
                        <Save size={18} />
                        {t.saveChanges[lang]}
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
                                <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2"><Truck size={14}/> {t.shippingCompany[lang]}</h3>
                                <div className="space-y-2">
                                    {country.shippingCompanies.map(sc => (
                                        <div key={sc} className="flex items-center justify-between bg-slate-900 p-2 rounded-lg border border-slate-800">
                                            <span className="text-sm text-slate-300">{sc}</span>
                                            <button onClick={() => removeShippingCompany(country.id, sc)} className="text-red-400 hover:text-red-300 transition-colors">
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
            </div>
        )}

        {activeTab === 'security' && (
            <div className="space-y-6 animate-fade-in">
                 <div className="bg-slate-800/50 border border-slate-700 p-8 rounded-2xl">
                     <div className="flex justify-between items-start mb-6">
                         <div>
                             <h2 className="text-xl font-bold text-white mb-2">{t.activeSessions[lang]}</h2>
                             <p className="text-slate-400 text-sm">{t.manageDevices[lang]}</p>
                         </div>
                         <button 
                            onClick={handleLogoutAll}
                            className="text-red-400 hover:text-red-300 text-sm font-medium border border-red-500/20 bg-red-500/5 px-4 py-2 rounded-xl transition-colors hover:bg-red-500/10"
                         >
                             {t.logoutAll[lang]}
                         </button>
                     </div>

                     <div className="space-y-4">
                         {sessions.map(session => (
                             <div key={session.id} className="flex items-center justify-between p-4 bg-slate-900 rounded-xl border border-slate-800">
                                 <div className="flex items-center gap-4">
                                     <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-slate-400">
                                         {session.device.toLowerCase().includes('phone') ? <Smartphone size={20} /> : <Monitor size={20} />}
                                     </div>
                                     <div>
                                         <p className="text-white font-medium flex items-center gap-2">
                                             {session.device}
                                             {session.current && <Badge variant="success">Current Device</Badge>}
                                         </p>
                                         <p className="text-xs text-slate-500 mt-1">
                                             {session.location} • {session.ip} • Last active {new Date(session.lastActive).toLocaleTimeString()}
                                         </p>
                                     </div>
                                 </div>
                             </div>
                         ))}
                     </div>
                 </div>

                 <div className="bg-slate-800/50 border border-slate-700 p-8 rounded-2xl">
                     <h2 className="text-xl font-bold text-white mb-2">{t.authentication[lang]}</h2>
                     <p className="text-slate-400 text-sm mb-6">{t.updatePass[lang]}</p>
                     
                     <div className="flex gap-4">
                         <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium text-sm transition-colors">
                             {t.changePassword[lang]}
                         </button>
                         <button className="px-4 py-2 border border-slate-600 text-slate-300 hover:text-white rounded-xl font-medium text-sm transition-colors">
                             {t.enable2FA[lang]}
                         </button>
                     </div>
                 </div>
            </div>
        )}

        {activeTab === 'health' && (
            <div className="space-y-8 animate-fade-in">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl">
                        <div className="flex items-center gap-3 text-slate-400 mb-2">
                            <Server size={18} />
                            <span className="text-sm font-medium">Webhook Events</span>
                        </div>
                        <div className="text-3xl font-bold text-white">{webhookEvents.length}</div>
                        <div className="text-xs text-slate-500 mt-1">Processed: {webhookEvents.filter(e => e.status === 'processed').length}</div>
                    </div>
                    
                    <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl">
                        <div className="flex items-center gap-3 text-slate-400 mb-2">
                            <ShieldCheck size={18} />
                            <span className="text-sm font-medium">Security Status</span>
                        </div>
                        <div className="text-3xl font-bold text-emerald-400">Secure</div>
                        <div className="text-xs text-slate-500 mt-1">Signature Verification Active</div>
                    </div>

                    <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl">
                        <div className="flex items-center gap-3 text-slate-400 mb-2">
                            <AlertTriangle size={18} />
                            <span className="text-sm font-medium">Failed Jobs (DLQ)</span>
                        </div>
                        <div className={`text-3xl font-bold ${failedJobs.length > 0 ? 'text-red-400' : 'text-white'}`}>{failedJobs.length}</div>
                        <div className="text-xs text-slate-500 mt-1">Requires Attention</div>
                    </div>
                </div>

                {/* Failed Jobs List */}
                {failedJobs.length > 0 && (
                    <div className="bg-red-900/10 border border-red-900/30 rounded-2xl p-6">
                        <h3 className="text-lg font-bold text-red-400 mb-4 flex items-center gap-2">
                            <AlertTriangle size={20} /> Failed Jobs (Dead Letter Queue)
                        </h3>
                        <div className="space-y-3">
                            {failedJobs.map(job => (
                                <div key={job.id} className="bg-slate-900 p-4 rounded-xl border border-red-500/20 flex items-center justify-between">
                                    <div>
                                        <div className="text-sm font-bold text-white">{job.type}</div>
                                        <div className="text-xs text-red-300 mt-1">Error: {job.error}</div>
                                        <div className="text-[10px] text-slate-500 mt-1">ID: {job.id} • {new Date(job.createdAt).toLocaleString()}</div>
                                    </div>
                                    <button 
                                        onClick={() => handleRetryJob(job.id)}
                                        className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition"
                                    >
                                        <RefreshCw size={14} /> Retry
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Recent Error Logs */}
                <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-white mb-4">Recent System Logs</h3>
                    <div className="h-64 overflow-y-auto space-y-2 pr-2">
                        {errorLogs.length === 0 ? (
                            <EmptyState 
                                icon={Server} 
                                title="System Healthy" 
                                description="No errors recorded in the last 24 hours." 
                            />
                        ) : (
                            errorLogs.map(log => (
                                <div key={log.id} className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-xs hover:border-slate-700 transition-colors">
                                    <div className="flex justify-between items-start mb-1">
                                        <Badge variant={log.severity === 'critical' ? 'error' : log.severity === 'error' ? 'error' : 'warning'}>
                                            {log.severity}
                                        </Badge>
                                        <span className="text-slate-500 font-mono">{new Date(log.timestamp).toLocaleTimeString()}</span>
                                    </div>
                                    <div className="text-slate-300 font-mono mb-1">{log.message}</div>
                                    {log.metadata && (
                                        <pre className="text-slate-600 overflow-x-auto text-[10px]">{JSON.stringify(log.metadata)}</pre>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};
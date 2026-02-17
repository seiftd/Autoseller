import React, { useState, useEffect } from 'react';
import { storageService } from '../services/storageService';
import { PublishLog, Language } from '../types';
import { TEXTS } from '../constants';
import { SectionHeader, Badge, EmptyState } from '../components/PremiumUI';
import { History, Facebook, Instagram, AlertCircle, CheckCircle } from 'lucide-react';

interface Props {
  lang: Language;
}

export const PublishHistory: React.FC<Props> = ({ lang }) => {
  const [logs, setLogs] = useState<PublishLog[]>([]);
  const t = TEXTS;

  useEffect(() => {
    setLogs(storageService.getPublishLogs());
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
        <SectionHeader title={t.history[lang]} />

        <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-2xl overflow-hidden">
             {logs.length === 0 ? (
                 <EmptyState 
                    icon={History} 
                    title="No History" 
                    description="No publishing activities recorded yet." 
                 />
             ) : (
                <div className="divide-y divide-slate-700/50">
                    {logs.map(log => (
                        <div key={log.id} className="p-6 hover:bg-slate-700/20 transition-colors">
                            <div className="flex flex-col md:flex-row justify-between gap-4 items-center">
                                <div className="flex items-center gap-4 w-full">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${log.platform === 'Facebook' ? 'bg-blue-900/20 text-blue-400' : 'bg-pink-900/20 text-pink-400'}`}>
                                        {log.platform === 'Facebook' ? <Facebook size={20} /> : <Instagram size={20} />}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-white text-sm">{log.productName}</h4>
                                        <p className="text-xs text-slate-400 mt-1">To: {log.accountName}</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                                    <div className="text-right">
                                        <div className="text-xs text-slate-500 uppercase tracking-wide font-bold">{log.publishType}</div>
                                        <div className="text-xs text-slate-400">{new Date(log.publishedAt).toLocaleString()}</div>
                                    </div>
                                    
                                    <Badge variant={log.status === 'success' ? 'success' : 'error'}>
                                        {log.status === 'success' ? (
                                            <div className="flex items-center gap-1"><CheckCircle size={12}/> Success</div>
                                        ) : (
                                            <div className="flex items-center gap-1"><AlertCircle size={12}/> Failed</div>
                                        )}
                                    </Badge>
                                </div>
                            </div>
                            {log.status === 'failed' && log.errorMessage && (
                                <div className="mt-4 p-3 bg-red-900/10 border border-red-500/10 rounded-lg text-xs text-red-300 font-mono">
                                    Error: {log.errorMessage}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
             )}
        </div>
    </div>
  );
};
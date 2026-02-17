import React, { useState, useEffect } from 'react';
import { storageService } from '../services/storageService';
import { AuditLog, Language } from '../types';
import { TEXTS } from '../constants';
import { SectionHeader, EmptyState } from '../components/PremiumUI';
import { Activity as ActivityIcon, User, Shield, Radio, Lock } from 'lucide-react';

interface Props {
  lang: Language;
}

export const Activity: React.FC<Props> = ({ lang }) => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const t = TEXTS;

  useEffect(() => {
    setLogs(storageService.getAuditLogs());
  }, []);

  const getIcon = (action: string) => {
      if (action.includes('login')) return <Lock size={16} />;
      if (action.includes('invite')) return <User size={16} />;
      if (action.includes('publish')) return <Radio size={16} />;
      return <Shield size={16} />;
  };

  return (
    <div className="space-y-6 animate-fade-in">
        <SectionHeader title={t.activity[lang]} />

        <div className="relative border-l-2 border-slate-800 ml-4 space-y-8">
             {logs.length === 0 ? (
                 <div className="ml-8">
                    <EmptyState 
                        icon={ActivityIcon} 
                        title="No Activity" 
                        description="Actions taken by your team will appear here." 
                    />
                 </div>
             ) : (
                logs.map(log => (
                    <div key={log.id} className="ml-6 relative">
                        <div className="absolute -left-[31px] bg-slate-900 border-2 border-slate-700 w-8 h-8 rounded-full flex items-center justify-center text-slate-400">
                            {getIcon(log.action)}
                        </div>
                        <div className="bg-slate-800/40 border border-slate-700/50 p-4 rounded-xl">
                            <div className="flex justify-between items-start mb-1">
                                <span className="text-white font-bold text-sm capitalize">{log.action.replace(/_/g, ' ')}</span>
                                <span className="text-xs text-slate-500">{new Date(log.timestamp).toLocaleString()}</span>
                            </div>
                            <div className="text-xs text-slate-400 mb-2">
                                Actor: <span className="text-slate-300">{log.userId}</span>
                            </div>
                            {log.details && (
                                <div className="bg-slate-900/50 p-2 rounded border border-slate-800 text-[10px] font-mono text-slate-500 overflow-x-auto">
                                    {JSON.stringify(log.details)}
                                </div>
                            )}
                        </div>
                    </div>
                ))
             )}
        </div>
    </div>
  );
};
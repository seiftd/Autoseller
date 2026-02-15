import React from 'react';
import { LucideIcon } from 'lucide-react';

interface Props {
  title: string;
  value: string | number;
  icon: LucideIcon;
  subtext?: string;
  trend?: string;
}

export const StatsCard: React.FC<Props> = ({ title, value, icon: Icon, subtext, trend }) => {
  return (
    <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 p-6 rounded-2xl relative overflow-hidden group hover:border-accent/50 transition-colors">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <Icon size={64} />
      </div>
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-2 text-slate-400">
          <Icon size={18} />
          <span className="text-sm font-medium">{title}</span>
        </div>
        <div className="text-3xl font-bold text-white mb-1">{value}</div>
        {subtext && <div className="text-xs text-slate-500">{subtext}</div>}
        {trend && <div className="text-xs text-emerald-400 mt-1">{trend}</div>}
      </div>
    </div>
  );
};
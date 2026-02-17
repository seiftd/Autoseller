import React from 'react';
import { LucideIcon } from 'lucide-react';

export const Spinner: React.FC<{ size?: 'sm' | 'md' | 'lg', className?: string }> = ({ size = 'md', className = '' }) => {
  const sizeClasses = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-8 h-8' };
  return (
    <svg className={`animate-spin text-current ${sizeClasses[size]} ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );
};

export const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`animate-pulse bg-slate-800/50 rounded-lg ${className}`}></div>
);

export const Badge: React.FC<{ variant: 'success' | 'warning' | 'error' | 'neutral' | 'info', children: React.ReactNode, className?: string }> = ({ variant, children, className = '' }) => {
  const variants = {
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    warning: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    error: 'bg-red-500/10 text-red-400 border-red-500/20',
    neutral: 'bg-slate-700/50 text-slate-400 border-slate-600/50',
    info: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

export const EmptyState: React.FC<{ icon: LucideIcon, title: string, description: string, action?: React.ReactNode }> = ({ icon: Icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center p-12 text-center bg-slate-800/30 border border-slate-800 border-dashed rounded-3xl animate-fade-in">
    <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mb-6 text-slate-500 shadow-inner">
      <Icon size={32} />
    </div>
    <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
    <p className="text-slate-400 max-w-sm mb-8 leading-relaxed">{description}</p>
    {action}
  </div>
);

export const ProgressBar: React.FC<{ value: number, max: number, label?: string, colorClass?: string, heightClass?: string }> = ({ value, max, label, colorClass = 'bg-blue-500', heightClass = 'h-2' }) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between text-xs mb-2">
          <span className="text-slate-400 font-medium">{label}</span>
          <span className="text-white font-bold">{Math.round(percentage)}%</span>
        </div>
      )}
      <div className={`${heightClass} bg-slate-800 rounded-full overflow-hidden border border-slate-700/50`}>
        <div 
          className={`h-full rounded-full transition-all duration-700 ease-out ${colorClass} shadow-[0_0_10px_rgba(59,130,246,0.5)]`} 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export const SectionHeader: React.FC<{ title: string, subtitle?: string, action?: React.ReactNode }> = ({ title, subtitle, action }) => (
  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
    <div>
      <h1 className="text-3xl font-bold text-white tracking-tight">{title}</h1>
      {subtitle && <p className="text-slate-400 mt-1 text-sm">{subtitle}</p>}
    </div>
    {action && <div>{action}</div>}
  </div>
);

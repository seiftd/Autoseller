import React, { useEffect, useState } from 'react';
import { storageService } from '../services/storageService';
import { UserStats, Language } from '../types';
import { TEXTS } from '../constants';
import { StatsCard } from '../components/StatsCard';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ShoppingBag, DollarSign, Package, MessageSquare, Clock, CheckCircle } from 'lucide-react';

interface Props {
  lang: Language;
}

export const Dashboard: React.FC<Props> = ({ lang }) => {
  const [stats, setStats] = useState<UserStats | null>(null);
  const t = TEXTS;

  useEffect(() => {
    // Basic polling to keep stats fresh with scheduler
    const load = () => setStats(storageService.getStats());
    load();
    const interval = setInterval(load, 10000);
    return () => clearInterval(interval);
  }, []);

  if (!stats) return null;

  // Mock data for chart
  const revenueData = [
    { name: 'Sat', val: 4000 },
    { name: 'Sun', val: 3000 },
    { name: 'Mon', val: 2000 },
    { name: 'Tue', val: 2780 },
    { name: 'Wed', val: 1890 },
    { name: 'Thu', val: 2390 },
    { name: 'Fri', val: 3490 },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">{t.dashboard[lang]}</h1>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-900/30 rounded-full border border-emerald-800 text-xs text-emerald-400">
           <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
           <span>System Operational</span>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title={t.totalOrders[lang]} 
          value={stats.totalOrders} 
          icon={Package} 
          trend="+5 today"
        />
        <StatsCard 
          title={t.totalRevenue[lang]} 
          value={`${stats.revenue.toLocaleString()} DA`} 
          icon={DollarSign} 
        />
        <StatsCard 
          title="Scheduled Posts" 
          value={stats.scheduledPosts} 
          icon={Clock} 
          subtext="Pending Publication"
        />
         <StatsCard 
          title="Published" 
          value={stats.publishedPosts} 
          icon={CheckCircle} 
          subtext="Live on Socials"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-slate-800/50 backdrop-blur-md border border-slate-700 p-6 rounded-2xl">
          <h3 className="text-lg font-semibold text-white mb-6">Revenue Overview (Last 7 Days)</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <XAxis 
                  dataKey="name" 
                  stroke="#64748b" 
                  tick={{ fill: '#64748b' }} 
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis hide />
                <Tooltip 
                  cursor={{ fill: '#1e293b' }}
                  contentStyle={{ 
                    backgroundColor: '#0f172a', 
                    border: '1px solid #1e293b',
                    borderRadius: '8px',
                    color: '#f8fafc'
                  }}
                />
                <Bar dataKey="val" radius={[4, 4, 0, 0]}>
                  {revenueData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill="#3b82f6" fillOpacity={0.8} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 p-6 rounded-2xl">
          <h3 className="text-lg font-semibold text-white mb-4">{t.recentOrders[lang]}</h3>
          <div className="space-y-4">
            {stats.recentOrders.length === 0 ? (
                <p className="text-slate-500 text-sm">No orders yet.</p>
            ) : (
                stats.recentOrders.map((order, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-700/30 transition-colors border border-slate-700/50">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 text-xs font-bold">
                                {order.customerName.charAt(0)}
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-200">{order.customerName}</p>
                                <p className="text-xs text-slate-500">{order.wilaya}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-bold text-white">{order.total} DA</p>
                            <span className="text-[10px] uppercase tracking-wide text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded">
                                {order.status}
                            </span>
                        </div>
                    </div>
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
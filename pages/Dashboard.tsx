import React, { useEffect, useState } from 'react';
import { storageService } from '../services/storageService';
import { rateLimitService } from '../services/rateLimitService';
import { authService } from '../services/authService';
import { UserStats, Language } from '../types';
import { TEXTS } from '../constants';
import { StatsCard } from '../components/StatsCard';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ShoppingBag, DollarSign, Package, Clock, CheckCircle, Zap, Activity } from 'lucide-react';
import { Skeleton, ProgressBar, SectionHeader } from '../components/PremiumUI';

interface Props {
  lang: Language;
}

export const Dashboard: React.FC<Props> = ({ lang }) => {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [dailyUsage, setDailyUsage] = useState(0);
  const [systemHealth, setSystemHealth] = useState(true);
  
  const user = authService.getCurrentUser();
  const t = TEXTS;

  useEffect(() => {
    // Simulate loading for Skeleton demo
    setTimeout(() => {
        loadData();
        setLoading(false);
    }, 800);

    // Poll for updates
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, []);

  const loadData = () => {
    const currentStats = storageService.getStats();
    setStats(currentStats);
    
    if (user) {
        setDailyUsage(rateLimitService.getDailyUsage(user.id));
    }
    
    // Mock system health check
    setSystemHealth(Math.random() > 0.1); 
  };

  const planLimit = user?.plan === 'free' ? 50 : (user?.plan === 'pro' ? 500 : 10000);

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
    <div className="space-y-8 animate-fade-in pb-12">
      <SectionHeader 
        title={t.dashboard[lang]}
        subtitle={lang === 'ar' ? `مرحباً بعودتك، ${user?.fullName || 'تاجر'}` : `Welcome back, ${user?.fullName || 'Merchant'}`}
        action={
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium transition-colors ${systemHealth ? 'bg-emerald-900/30 border-emerald-800 text-emerald-400' : 'bg-red-900/30 border-red-800 text-red-400'}`}>
               <div className={`w-2 h-2 rounded-full animate-pulse ${systemHealth ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
               <span>{systemHealth ? t.systemOperational[lang] : t.degradedPerformance[lang]}</span>
            </div>
        }
      />

      {/* Usage Meter */}
      {!loading && user && (
          <div className="bg-slate-800/40 border border-slate-700/50 p-6 rounded-2xl flex flex-col md:flex-row items-center gap-6 shadow-sm">
              <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400">
                  <Zap size={24} />
              </div>
              <div className="flex-1 w-full">
                  <div className="flex justify-between items-end mb-2">
                      <div>
                          <h3 className="text-white font-bold text-lg">{t.dailyAiUsage[lang]}</h3>
                          <p className="text-slate-400 text-xs">{t.plan[lang]}: <span className="uppercase text-blue-400 font-bold">{user.plan}</span></p>
                      </div>
                      <div className="text-right">
                          <span className="text-2xl font-bold text-white">{dailyUsage}</span>
                          <span className="text-slate-500 text-sm"> / {planLimit === 10000 ? '∞' : planLimit}</span>
                      </div>
                  </div>
                  <ProgressBar 
                    value={dailyUsage} 
                    max={planLimit === 10000 ? dailyUsage * 1.5 : planLimit} 
                    colorClass={dailyUsage > planLimit * 0.9 ? 'bg-red-500' : 'bg-blue-500'}
                  />
              </div>
              <div className="hidden md:block w-px h-12 bg-slate-700"></div>
              <div className="flex gap-4">
                  <div className="text-center">
                      <div className="text-emerald-400 font-bold text-xl">98%</div>
                      <div className="text-slate-500 text-xs">{t.successRate[lang]}</div>
                  </div>
                  <div className="text-center">
                      <div className="text-blue-400 font-bold text-xl">1.2s</div>
                      <div className="text-slate-500 text-xs">{t.avgResponse[lang]}</div>
                  </div>
              </div>
          </div>
      )}

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
            Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-32" />)
        ) : (
            <>
                <StatsCard 
                  title={t.totalOrders[lang]} 
                  value={stats?.totalOrders || 0} 
                  icon={Package} 
                  trend={lang === 'ar' ? "+5 اليوم" : "+5 today"}
                />
                <StatsCard 
                  title={t.totalRevenue[lang]} 
                  value={`${stats?.revenue.toLocaleString()} DA`} 
                  icon={DollarSign} 
                />
                <StatsCard 
                  title={t.scheduledPosts[lang]} 
                  value={stats?.scheduledPosts || 0} 
                  icon={Clock} 
                  subtext={t.pendingPublication[lang]}
                />
                <StatsCard 
                  title={t.publishedStatus[lang]} 
                  value={stats?.publishedPosts || 0} 
                  icon={CheckCircle} 
                  subtext={t.liveOnSocials[lang]}
                />
            </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-slate-800/50 backdrop-blur-md border border-slate-700 p-6 rounded-2xl shadow-sm">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Activity size={18} className="text-blue-500" /> {t.revenueOverview[lang]}
          </h3>
          <div className="h-[300px]">
            {loading ? <Skeleton className="w-full h-full" /> : (
                <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                    <XAxis 
                    dataKey="name" 
                    stroke="#64748b" 
                    tick={{ fill: '#64748b', fontSize: 12 }} 
                    axisLine={false}
                    tickLine={false}
                    reversed={lang === 'ar'} // Reverse Axis for RTL
                    />
                    <YAxis hide />
                    <Tooltip 
                    cursor={{ fill: '#1e293b' }}
                    contentStyle={{ 
                        backgroundColor: '#0f172a', 
                        border: '1px solid #1e293b',
                        borderRadius: '12px',
                        color: '#f8fafc',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        textAlign: lang === 'ar' ? 'right' : 'left'
                    }}
                    />
                    <Bar dataKey="val" radius={[6, 6, 0, 0]}>
                    {revenueData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill="#3b82f6" fillOpacity={0.8} />
                    ))}
                    </Bar>
                </BarChart>
                </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 p-6 rounded-2xl shadow-sm">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <ShoppingBag size={18} className="text-emerald-500" /> {t.recentOrders[lang]}
          </h3>
          <div className="space-y-4">
            {loading ? (
                Array(3).fill(0).map((_, i) => <div key={i} className="flex gap-4"><Skeleton className="w-10 h-10 rounded-full" /><div className="flex-1 space-y-2"><Skeleton className="h-4 w-1/2" /><Skeleton className="h-3 w-1/3" /></div></div>)
            ) : stats?.recentOrders.length === 0 ? (
                <div className="text-center py-8 text-slate-500 border border-dashed border-slate-700 rounded-xl bg-slate-900/30">
                    <Package className="mx-auto mb-2 opacity-50" />
                    <p className="text-sm font-medium">{t.noOrders[lang]}</p>
                </div>
            ) : (
                stats?.recentOrders.map((order, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-700/30 transition-colors border border-slate-700/50 group cursor-pointer">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold shadow-lg">
                                {order.customerName.charAt(0)}
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors">{order.customerName}</p>
                                <p className="text-xs text-slate-500">{order.wilaya}</p>
                            </div>
                        </div>
                        <div className="text-end">
                            <p className="text-sm font-bold text-white">{order.total} DA</p>
                            <span className={`text-[10px] uppercase font-bold ${order.status === 'pending' ? 'text-yellow-500' : 'text-emerald-500'}`}>{order.status}</span>
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
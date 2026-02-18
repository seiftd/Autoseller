import React, { useEffect, useState } from 'react';
import { storageService } from '../services/storageService';
import { rateLimitService } from '../services/rateLimitService';
import { authService } from '../services/authService';
import { UserStats, Language, SocialAccount } from '../types';
import { TEXTS } from '../constants';
import { StatsCard } from '../components/StatsCard';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ShoppingBag, DollarSign, Package, Clock, CheckCircle, Zap, Activity, AlertTriangle, ShieldCheck } from 'lucide-react';
import { Skeleton, ProgressBar, SectionHeader, Badge } from '../components/PremiumUI';

interface Props {
    lang: Language;
}

export const Dashboard: React.FC<Props> = ({ lang }) => {
    const [stats, setStats] = useState<UserStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [dailyUsage, setDailyUsage] = useState(0);
    const [systemHealth, setSystemHealth] = useState(true);
    const [accounts, setAccounts] = useState<SocialAccount[]>([]);

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
        setAccounts(storageService.getAccounts());

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

    // Helper to check token health
    const getAccountHealth = (acc: SocialAccount) => {
        if (!acc.connected) return 'disconnected';
        if (!acc.tokenExpiry) return 'healthy';
        const daysLeft = (acc.tokenExpiry - Date.now()) / (1000 * 60 * 60 * 24);
        if (daysLeft < 0) return 'expired';
        if (daysLeft < 7) return 'warning';
        return 'healthy';
    };

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

            {/* Account Health Monitor Widget */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 bg-slate-800/40 border border-slate-700/50 p-6 rounded-2xl flex flex-col md:flex-row items-center gap-6 shadow-sm">
                    <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400">
                        <Zap size={24} />
                    </div>
                    <div className="flex-1 w-full">
                        <div className="flex justify-between items-end mb-2">
                            <div>
                                <h3 className="text-white font-bold text-lg">{t.dailyAiUsage[lang]}</h3>
                                <p className="text-slate-400 text-xs">{t.plan[lang]}: <span className="uppercase text-blue-400 font-bold">{user?.plan}</span></p>
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
                </div>

                <div className="bg-slate-800/40 border border-slate-700/50 p-6 rounded-2xl flex flex-col justify-between">
                    <h3 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
                        <ShieldCheck size={16} className="text-emerald-400" />
                        {t.accountHealth[lang]}
                    </h3>
                    <div className="space-y-3">
                        {accounts.length === 0 ? (
                            <div className="text-xs text-slate-500 italic">No accounts connected</div>
                        ) : (
                            accounts.map(acc => {
                                const status = getAccountHealth(acc);
                                return (
                                    <div key={acc.id} className="flex justify-between items-center text-xs">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-1.5 h-1.5 rounded-full ${status === 'healthy' ? 'bg-emerald-500' : status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                                            <span className="text-slate-300">{acc.name}</span>
                                        </div>
                                        {status === 'warning' && <Badge variant="warning">{t.tokenExpiring[lang]}</Badge>}
                                        {status === 'expired' && <Badge variant="error">Expired</Badge>}
                                        {status === 'healthy' && <span className="text-emerald-500 font-medium">OK</span>}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>

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
                    <div className="h-[300px] flex items-center justify-center border border-dashed border-slate-700 rounded-xl bg-slate-900/20">
                        <div className="text-center">
                            <Activity size={48} className="text-slate-700 mx-auto mb-4 opacity-20" />
                            <p className="text-slate-500 font-medium">Revenue Chart (Optimizing for React 19...)</p>
                        </div>
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
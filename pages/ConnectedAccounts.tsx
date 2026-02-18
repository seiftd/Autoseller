import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { storageService } from '../services/storageService';
import { webhookService } from '../services/webhookService';
import { facebookService } from '../services/facebookService';
import { processOAuthCallback, getAccountHealthStatus, getHealthLabel, getTokenExpiryText, runTokenHealthCheck } from '../services/tokenService';
import { SocialAccount, Language } from '../types';
import { TEXTS } from '../constants';
import {
    Facebook, Instagram, RefreshCw, XCircle, Settings, AlertTriangle, Zap,
    ShieldCheck, Check, ChevronDown, ChevronUp, Share2, Clock, Wifi, WifiOff,
    ExternalLink, Copy, CheckCircle2, Info
} from 'lucide-react';
import { EmptyState, Spinner, Badge, SectionHeader } from '../components/PremiumUI';
import { useToast } from '../contexts/ToastContext';

interface Props {
    lang: Language;
}

export const ConnectedAccounts: React.FC<Props> = ({ lang }) => {
    const [accounts, setAccounts] = useState<SocialAccount[]>([]);
    const [loading, setLoading] = useState(false);
    const [expandedStep, setExpandedStep] = useState<number | null>(null);
    const [webhookCopied, setWebhookCopied] = useState(false);
    const [tokenCopied, setTokenCopied] = useState(false);
    const { showToast } = useToast();
    const location = useLocation();
    const navigate = useNavigate();
    const t = TEXTS;

    const webhookConfig = webhookService.getWebhookConfig();

    const loadData = useCallback(() => {
        setAccounts(storageService.getAccounts());
    }, []);

    // Handle OAuth callback redirect
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const oauthSuccess = params.get('oauth_success');
        const payload = params.get('payload');
        const error = params.get('error');

        if (error) {
            const errorMessages: Record<string, string> = {
                access_denied: 'You cancelled the Facebook login. Please try again.',
                no_pages: 'No Facebook Pages found. Please create a Page first.',
                server_error: `Connection error: ${params.get('msg') || 'Unknown error'}`,
            };
            showToast(errorMessages[error] || 'Connection failed.', 'error');
            navigate('/connected-accounts', { replace: true });
            return;
        }

        if (oauthSuccess && payload) {
            const newAccounts = processOAuthCallback(payload);
            if (newAccounts.length > 0) {
                const existing = storageService.getAccounts().filter(
                    a => !newAccounts.find(n => n.pageId === a.pageId)
                );
                storageService.saveAccounts([...existing, ...newAccounts]);
                loadData();
                showToast(`Successfully connected ${newAccounts.length} account(s)!`, 'success');

                // Warn about pages without Instagram
                const noIg = newAccounts.filter(a => a.platform === 'Facebook' && !a.instagramLinked);
                if (noIg.length > 0) {
                    showToast(
                        `${noIg.length} page(s) have no linked Instagram Business account.`,
                        'warning'
                    );
                }
            }
            navigate('/connected-accounts', { replace: true });
        }
    }, [location.search]);

    useEffect(() => {
        loadData();
        // Run token health check on mount
        runTokenHealthCheck().then(loadData);
    }, []);

    const handleConnectFacebook = () => {
        try {
            setLoading(true);
            facebookService.initiateOAuth();
            // Page will redirect — loading state will reset on return
        } catch (err: any) {
            showToast(err.message, 'error');
            setLoading(false);
        }
    };

    const handleDisconnect = (id: string) => {
        if (!confirm('Disconnect this account? This will stop auto-replies for this page.')) return;
        const updated = accounts.filter(a => a.id !== id);
        storageService.saveAccounts(updated);
        setAccounts(updated);
        showToast('Account disconnected.', 'info');
    };

    const handleSimulateWebhook = (pageId: string) => {
        webhookService.simulateTestComment(pageId);
        showToast('Test webhook triggered. Check Dashboard health.', 'info');
    };

    const handleCopy = async (text: string, type: 'webhook' | 'token') => {
        await navigator.clipboard.writeText(text);
        if (type === 'webhook') {
            setWebhookCopied(true);
            setTimeout(() => setWebhookCopied(false), 2000);
        } else {
            setTokenCopied(true);
            setTimeout(() => setTokenCopied(false), 2000);
        }
        showToast('Copied to clipboard!', 'success');
    };

    const getIcon = (platform: string) => {
        if (platform === 'Facebook') return <Facebook className="text-[#1877F2]" size={28} />;
        return <Instagram className="text-[#E4405F]" size={28} />;
    };

    const healthSummary = storageService.getAccountHealthSummary();

    const steps = [
        {
            title: 'Create Facebook Developer App',
            content: 'Go to developers.facebook.com → Create App → Select "Business" type. Copy your App ID and App Secret.',
        },
        {
            title: 'Set Netlify Environment Variables',
            content: 'In your Netlify dashboard → Site Settings → Environment Variables, add: FB_APP_ID, FB_APP_SECRET, ENCRYPTION_KEY (32-char random string), WEBHOOK_VERIFY_TOKEN (any random string), FB_REDIRECT_URI (your Netlify function URL).',
        },
        {
            title: 'Configure Webhook in Meta Developer Portal',
            content: 'In your Meta App → Webhooks → Add Callback URL (use the URL below) and Verify Token. Subscribe to: feed, messages, mention fields.',
        },
        {
            title: 'Add Required Permissions',
            content: 'Request: pages_manage_posts, pages_read_engagement, pages_manage_metadata, pages_messaging, instagram_basic, instagram_manage_messages, instagram_manage_comments, instagram_content_publish.',
        },
        {
            title: 'Link Instagram Business Account',
            content: 'In your Facebook Page Settings → Instagram → Connect Account. Make sure your Instagram is switched to "Business" mode first.',
        },
    ];

    return (
        <div className="space-y-8 animate-fade-in pb-12">
            <SectionHeader
                title={t.connectedAccounts[lang]}
                subtitle="Manage your social media integrations"
                action={
                    <button
                        onClick={handleConnectFacebook}
                        disabled={loading}
                        className="flex items-center gap-2 bg-[#1877F2] hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl transition-colors font-bold shadow-lg shadow-blue-900/20 disabled:opacity-60"
                    >
                        {loading ? <Spinner size="sm" /> : <Facebook size={18} />}
                        Connect Facebook
                    </button>
                }
            />

            {/* Meta App Review Transparency Notice */}
            <div className="bg-blue-500/5 border border-blue-500/20 p-4 rounded-xl flex items-start gap-3">
                <Info size={18} className="text-blue-400 mt-0.5 shrink-0" />
                <p className="text-sm text-slate-300">
                    <span className="font-semibold text-blue-300">Transparency Notice: </span>
                    ReplyGenie only accesses publishing, comment replies, and direct message responses
                    related to connected Pages. We do not access personal profiles or private conversations.
                </p>
            </div>

            {/* Health Summary Bar */}
            {accounts.length > 0 && (
                <div className="grid grid-cols-3 gap-4">
                    {[
                        { label: 'Healthy', count: healthSummary.healthy, emoji: '🟢', color: 'border-emerald-500/20 bg-emerald-500/5' },
                        { label: 'Expiring Soon', count: healthSummary.expiring, emoji: '🟡', color: 'border-yellow-500/20 bg-yellow-500/5' },
                        { label: 'Action Required', count: healthSummary.actionRequired, emoji: '🔴', color: 'border-red-500/20 bg-red-500/5' },
                    ].map(item => (
                        <div key={item.label} className={`p-4 rounded-xl border ${item.color} text-center`}>
                            <div className="text-2xl font-bold text-white">{item.count}</div>
                            <div className="text-xs text-slate-400 mt-1">{item.emoji} {item.label}</div>
                        </div>
                    ))}
                </div>
            )}

            {/* Account Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {accounts.map((account) => {
                    const healthStatus = getAccountHealthStatus(account);
                    const healthInfo = getHealthLabel(healthStatus);
                    const expiryText = getTokenExpiryText(account.tokenExpiry);

                    return (
                        <div key={account.id} className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 relative overflow-hidden group hover:border-slate-600 transition-all">
                            {/* Health Badge */}
                            <div className="absolute top-4 right-4">
                                <span className={`text-xs font-bold px-2 py-1 rounded-full border ${healthStatus === 'healthy' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
                                        healthStatus === 'expiring_soon' ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400' :
                                            'bg-red-500/10 border-red-500/30 text-red-400'
                                    }`}>
                                    {healthInfo.emoji} {healthInfo.label}
                                </span>
                            </div>

                            <div className="flex flex-col items-center text-center space-y-4 pt-4">
                                {/* Avatar */}
                                <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center border-2 border-slate-700 shadow-xl relative">
                                    {account.avatarUrl ? (
                                        <img src={account.avatarUrl} alt={account.name} className="w-full h-full rounded-full object-cover" />
                                    ) : (
                                        getIcon(account.platform)
                                    )}
                                    <div className="absolute -bottom-1 -right-1 bg-slate-900 rounded-full p-1 border border-slate-700">
                                        {account.platform === 'Facebook'
                                            ? <Facebook size={12} className="text-blue-500" />
                                            : <Instagram size={12} className="text-pink-500" />
                                        }
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-base font-bold text-white">{account.name}</h3>
                                    {account.pageId && (
                                        <p className="text-xs text-slate-500 font-mono mt-1">ID: {account.pageId}</p>
                                    )}
                                </div>

                                {/* Token Expiry */}
                                <div className="w-full bg-slate-900/50 rounded-lg p-3 space-y-2 text-xs">
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-500 flex items-center gap-1"><Clock size={12} /> Token</span>
                                        <span className={`font-medium ${healthStatus === 'healthy' ? 'text-emerald-400' :
                                                healthStatus === 'expiring_soon' ? 'text-yellow-400' : 'text-red-400'
                                            }`}>{expiryText}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-500 flex items-center gap-1">
                                            {account.subscriptionStatus ? <Wifi size={12} /> : <WifiOff size={12} />} Webhooks
                                        </span>
                                        <span className={account.subscriptionStatus ? 'text-emerald-400' : 'text-yellow-400'}>
                                            {account.subscriptionStatus ? 'Subscribed' : 'Not subscribed'}
                                        </span>
                                    </div>
                                    {account.platform === 'Facebook' && (
                                        <div className="flex items-center justify-between">
                                            <span className="text-slate-500 flex items-center gap-1"><Instagram size={12} /> Instagram</span>
                                            <span className={account.instagramLinked ? 'text-emerald-400' : 'text-yellow-400'}>
                                                {account.instagramLinked ? 'Linked' : 'Not linked'}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Instagram Warning */}
                                {account.platform === 'Facebook' && !account.instagramLinked && (
                                    <div className="w-full bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-2 flex items-start gap-2">
                                        <AlertTriangle size={12} className="text-yellow-400 mt-0.5 shrink-0" />
                                        <p className="text-xs text-yellow-300">Instagram Business account not linked to this Page.</p>
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="w-full pt-2 border-t border-slate-700/50 space-y-2">
                                    {healthStatus === 'reconnection_required' ? (
                                        <button
                                            onClick={handleConnectFacebook}
                                            className="w-full py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold flex items-center justify-center gap-2 transition-colors border border-red-500/20"
                                        >
                                            <RefreshCw size={14} /> Reconnect Account
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleSimulateWebhook(account.pageId || '')}
                                            className="w-full py-2.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                                        >
                                            <Zap size={14} /> Test Auto-Reply
                                        </button>
                                    )}

                                    <button
                                        onClick={() => handleDisconnect(account.id)}
                                        className="w-full py-2.5 rounded-xl font-medium transition-all flex items-center justify-center gap-2 text-xs bg-slate-900 hover:bg-red-500/10 hover:text-red-400 text-slate-400 border border-slate-700"
                                    >
                                        <XCircle size={14} /> Disconnect
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {/* Connect New Button */}
                <div
                    onClick={!loading ? handleConnectFacebook : undefined}
                    className={`border-2 border-dashed border-slate-700 rounded-2xl p-6 flex flex-col items-center justify-center text-slate-500 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all cursor-pointer group min-h-[300px] ${loading ? 'opacity-50 pointer-events-none' : ''}`}
                >
                    {loading ? (
                        <Spinner size="lg" className="text-blue-500 mb-4" />
                    ) : (
                        <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-inner">
                            <Share2 size={28} className="text-blue-500" />
                        </div>
                    )}
                    <p className="font-bold text-lg text-slate-300">{loading ? 'Redirecting...' : 'Connect New Account'}</p>
                    <p className="text-xs text-slate-500 mt-2 max-w-[200px] text-center">
                        Secure redirect-based OAuth — no tokens exposed in browser
                    </p>
                </div>
            </div>

            {/* Webhook Configuration */}
            <div className="bg-slate-800/30 border border-slate-700 rounded-2xl p-6 space-y-4">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <ShieldCheck className="text-emerald-500" size={20} /> Webhook Configuration
                </h2>
                <p className="text-sm text-slate-400">
                    Use these values when configuring your webhook in the Meta Developer Portal.
                </p>
                <div className="space-y-3">
                    <div>
                        <label className="text-xs text-slate-500 mb-1 block">Callback URL</label>
                        <div className="flex items-center gap-2">
                            <code className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-300 font-mono truncate">
                                {webhookConfig.callbackUrl}
                            </code>
                            <button
                                onClick={() => handleCopy(webhookConfig.callbackUrl, 'webhook')}
                                className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors text-slate-400"
                            >
                                {webhookCopied ? <CheckCircle2 size={16} className="text-emerald-400" /> : <Copy size={16} />}
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className="text-xs text-slate-500 mb-1 block">Verify Token (set this in Meta Portal AND in Netlify env as WEBHOOK_VERIFY_TOKEN)</label>
                        <div className="flex items-center gap-2">
                            <code className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-300 font-mono">
                                {webhookConfig.verifyToken}
                            </code>
                            <button
                                onClick={() => handleCopy(webhookConfig.verifyToken, 'token')}
                                className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors text-slate-400"
                            >
                                {tokenCopied ? <CheckCircle2 size={16} className="text-emerald-400" /> : <Copy size={16} />}
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className="text-xs text-slate-500 mb-1 block">Subscribed Fields</label>
                        <div className="flex gap-2 flex-wrap">
                            {webhookConfig.subscribedFields.map(f => (
                                <span key={f} className="text-xs bg-slate-900 border border-slate-700 px-2 py-1 rounded-md text-slate-300 font-mono">{f}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Setup Guide + Privacy */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <Settings className="text-blue-400" size={20} /> Setup Guide
                    </h2>
                    <div className="space-y-3">
                        {steps.map((step, idx) => (
                            <div key={idx} className="bg-slate-800/30 border border-slate-700/50 rounded-xl overflow-hidden hover:border-blue-500/30 transition-colors">
                                <button
                                    onClick={() => setExpandedStep(expandedStep === idx ? null : idx)}
                                    className="w-full flex items-center justify-between p-4 text-left"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${expandedStep === idx ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-400'}`}>
                                            {idx + 1}
                                        </div>
                                        <span className={`font-medium ${expandedStep === idx ? 'text-white' : 'text-slate-300'}`}>{step.title}</span>
                                    </div>
                                    {expandedStep === idx ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
                                </button>
                                {expandedStep === idx && (
                                    <div className="p-4 pt-0 pl-16 text-slate-400 text-sm leading-relaxed border-t border-slate-700/50 bg-slate-900/20">
                                        {step.content}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Privacy Card */}
                <div className="lg:col-span-1">
                    <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 p-6 rounded-2xl sticky top-24">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                                <ShieldCheck className="text-green-400" size={22} />
                            </div>
                            <div>
                                <h3 className="font-bold text-white">Data Privacy</h3>
                                <p className="text-xs text-green-400 font-medium bg-green-900/30 px-2 py-0.5 rounded-full inline-block mt-1">100% Compliant</p>
                            </div>
                        </div>

                        <p className="text-sm text-slate-300 mb-4 leading-relaxed">ReplyGenie only requests permissions necessary to automate your business:</p>

                        <ul className="space-y-3 mb-6">
                            {[
                                { text: 'Publish & Edit Posts', desc: 'To upload products automatically' },
                                { text: 'Reply to Comments', desc: 'To answer customer pricing questions' },
                                { text: 'Send Direct Messages', desc: 'To take orders privately' },
                            ].map((perm, i) => (
                                <li key={i} className="flex gap-3 text-sm">
                                    <Check size={16} className="text-blue-500 mt-0.5 shrink-0" />
                                    <div>
                                        <span className="text-slate-200 font-medium block">{perm.text}</span>
                                        <span className="text-slate-500 text-xs">{perm.desc}</span>
                                    </div>
                                </li>
                            ))}
                        </ul>

                        <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800 text-xs space-y-2">
                            <p className="flex items-center gap-2 text-slate-400"><XCircle size={12} className="text-red-400" /> We do NOT access personal profiles</p>
                            <p className="flex items-center gap-2 text-slate-400"><XCircle size={12} className="text-red-400" /> We do NOT read private personal chats</p>
                            <p className="flex items-center gap-2 text-slate-400"><ShieldCheck size={12} className="text-emerald-400" /> Tokens encrypted with AES-256-GCM</p>
                            <p className="flex items-center gap-2 text-slate-400"><RefreshCw size={12} className="text-blue-400" /> Auto-refresh before expiry</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

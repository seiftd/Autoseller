import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { SectionHeader } from '../components/PremiumUI';
import { CheckCircle2, Zap, Crown, TrendingUp } from 'lucide-react';
import { Language } from '../types';
import { TEXTS } from '../constants';

interface Props {
    lang: Language;
}

export const Billing: React.FC<Props> = ({ lang }) => {
    const { user } = useUser();
    const t = TEXTS;

    // Placeholder for real subscription status check
    const currentPlan = (user?.publicMetadata?.plan as string) || 'free';

    const handleCheckout = (url: string) => {
        window.location.href = url;
    };

    const PLANS = [
        {
            id: 'pro',
            name: 'Pro Plan',
            price: '$29',
            period: '/month',
            description: 'Perfect for growing businesses',
            features: ['Unlimited Auto-Replies', 'Facebook & Instagram', 'Advanced Analytics', 'Priority Support'],
            checkoutUrl: 'https://checkout.dodopayments.com/buy/pdt_0NYh5jjf8SbnqYXPrcbtD?quantity=1',
            icon: Zap,
            color: 'blue'
        },
        {
            id: 'business',
            name: 'Business Plan',
            price: '$99',
            period: '/month',
            description: 'For large teams and high volume',
            features: ['Everything in Pro', 'Unlimited Team Members', 'Custom AI Training', 'Dedicated Account Manager'],
            checkoutUrl: 'https://checkout.dodopayments.com/buy/pdt_0NYhNkp613RAhMBIFp1aC?quantity=1',
            icon: Crown,
            popular: true,
            color: 'yellow'
        }
    ];

    return (
        <div className="space-y-8 animate-fade-in pb-12">
            <SectionHeader title={t.billing[lang]} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {PLANS.map((plan) => {
                    const isCurrent = currentPlan === plan.id;
                    return (
                        <div key={plan.id} className={`relative p-8 rounded-3xl border ${plan.popular ? 'bg-slate-800/80 border-blue-500/50 shadow-xl shadow-blue-900/10' : 'bg-slate-800/40 border-slate-700'}`}>
                            {plan.popular && (
                                <div className="absolute top-0 right-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold px-4 py-1.5 rounded-bl-xl rounded-tr-3xl">
                                    MOST POPULAR
                                </div>
                            )}

                            <div className="flex items-center gap-4 mb-6">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${plan.color === 'yellow' ? 'bg-yellow-500/10 text-yellow-400' : 'bg-blue-500/10 text-blue-400'}`}>
                                    <plan.icon size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                                    <p className="text-slate-400 text-sm">{plan.description}</p>
                                </div>
                            </div>

                            <div className="mb-8">
                                <span className="text-4xl font-bold text-white">{plan.price}</span>
                                <span className="text-slate-500">{plan.period}</span>
                            </div>

                            <ul className="space-y-4 mb-8">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-center gap-3 text-slate-300">
                                        <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
                                        <span className="text-sm">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => handleCheckout(plan.checkoutUrl)}
                                disabled={isCurrent}
                                className={`w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${isCurrent
                                        ? 'bg-slate-700 text-slate-400 cursor-default'
                                        : 'bg-white text-slate-900 hover:bg-slate-200 shadow-lg shadow-white/5'
                                    }`}
                            >
                                {isCurrent ? 'Current Plan' : (
                                    <> Get Started <TrendingUp size={18} /> </>
                                )}
                            </button>
                        </div>
                    );
                })}
            </div>

            <div className="mt-8 p-6 bg-slate-800/30 rounded-2xl border border-slate-700/50 text-center">
                <p className="text-slate-400 text-sm">
                    Payments are securely processed by Dodo Payments. You can cancel anytime from your dashboard.
                </p>
            </div>
        </div>
    );
};
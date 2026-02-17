import { AddOn, PlanLimits, SubscriptionPlan } from '../types';
import { storageService } from './storageService';
import { authService } from './authService';

export const AVAILABLE_ADDONS: AddOn[] = [
  { id: 'extra_account_1', name: '+1 Social Account', description: 'Connect one additional social media account', priceMonthly: 2, featureKey: 'extra_account', type: 'quantity' },
  { id: 'extra_account_2', name: '+2 Social Accounts', description: 'Connect two additional social media accounts', priceMonthly: 4, featureKey: 'extra_account', type: 'quantity' },
  { id: 'recurring_posts', name: 'Recurring Posts', description: 'Enable auto-reposting of products every X days', priceMonthly: 5, featureKey: 'recurring_posts', type: 'feature' },
  { id: 'advanced_analytics', name: 'Advanced Analytics', description: 'Deep insights into revenue and engagement', priceMonthly: 3, featureKey: 'advanced_analytics', type: 'feature' },
  { id: 'priority_alerts', name: 'Priority Email Alerts', description: 'Instant notification on failures and orders', priceMonthly: 1, featureKey: 'priority_alerts', type: 'feature' },
  { id: 'extra_replies', name: 'Extra 500 Replies', description: 'Add 500 more auto-replies to your monthly quota', priceMonthly: 2, featureKey: 'extra_replies', type: 'quantity' },
];

const BASE_LIMITS: Record<SubscriptionPlan, PlanLimits> = {
  free: {
    socialAccounts: 1,
    monthlyReplies: 50,
    teamMembers: 0,
    recurringPosts: false,
    advancedAnalytics: false
  },
  pro: {
    socialAccounts: 3,
    monthlyReplies: 10000, // effectively unlimited for pro compared to free
    teamMembers: 0,
    recurringPosts: false, // Locked unless addon bought
    advancedAnalytics: false // Locked unless addon bought
  },
  business: {
    socialAccounts: 10,
    monthlyReplies: 100000,
    teamMembers: 5,
    recurringPosts: true,
    advancedAnalytics: true
  }
};

const PLAN_PRICES: Record<SubscriptionPlan, number> = {
  free: 0,
  pro: 29,
  business: 99
};

export const billingService = {
  
  getPlanLimits: (): PlanLimits => {
    const user = authService.getCurrentUser();
    if (!user) return BASE_LIMITS.free;

    const base = BASE_LIMITS[user.plan];
    
    // If Business, they get everything, addons don't typically apply or are included
    if (user.plan === 'business') return base;

    // For Pro/Free, add Add-ons
    const activeAddons = storageService.getUserAddons();
    const limits = { ...base };

    activeAddons.forEach(ua => {
        const addon = AVAILABLE_ADDONS.find(a => a.id === ua.addonId);
        if (!addon) return;

        if (addon.featureKey === 'extra_account') {
            const count = addon.id.includes('_2') ? 2 : 1;
            limits.socialAccounts += count;
        }
        if (addon.featureKey === 'extra_replies') {
            limits.monthlyReplies += 500;
        }
        if (addon.featureKey === 'recurring_posts') {
            limits.recurringPosts = true;
        }
        if (addon.featureKey === 'advanced_analytics') {
            limits.advancedAnalytics = true;
        }
    });

    return limits;
  },

  getCurrentBill: (): { base: number, addons: number, total: number } => {
      const user = authService.getCurrentUser();
      if (!user) return { base: 0, addons: 0, total: 0 };

      const basePrice = PLAN_PRICES[user.plan];
      
      // Addons only cost money for Pro/Free (Business includes most, but let's assume addons are for Pro primarily)
      let addonsPrice = 0;
      if (user.plan !== 'business') {
          const activeAddons = storageService.getUserAddons();
          activeAddons.forEach(ua => {
              const addon = AVAILABLE_ADDONS.find(a => a.id === ua.addonId);
              if (addon) addonsPrice += addon.priceMonthly;
          });
      }

      return {
          base: basePrice,
          addons: addonsPrice,
          total: basePrice + addonsPrice
      };
  },

  canAccessFeature: (feature: keyof PlanLimits): boolean => {
      const limits = billingService.getPlanLimits();
      const val = limits[feature];
      if (typeof val === 'boolean') return val;
      return val > 0;
  },

  canAccessTeam: (): boolean => {
      const user = authService.getCurrentUser();
      return user?.plan === 'business';
  },

  checkSocialAccountLimit: (): boolean => {
      const accounts = storageService.getAccounts();
      const limits = billingService.getPlanLimits();
      return accounts.length < limits.socialAccounts;
  }
};
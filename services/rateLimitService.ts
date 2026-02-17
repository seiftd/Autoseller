import { authService } from './authService';
import { User, SubscriptionPlan } from '../types';
import { storageService } from './storageService';

// In-Memory Rate Limit Store (In production, use Redis)
// Key: "userId:action" -> { count, windowStart }
const limitStore: Record<string, { count: number, windowStart: number }> = {};

// Usage Quotas Store (Persist daily usage)
// Key: "userId:date:action" -> count
const quotaStore: Record<string, number> = {};

const LIMITS = {
  'publish_post': { window: 60000, max: 10 }, // 10 per min
  'auto_reply': { window: 60000, max: 30 },   // 30 per min
  'api_call': { window: 60000, max: 100 }     // 100 per min
};

const PLAN_QUOTAS: Record<SubscriptionPlan, { dailyReplies: number }> = {
  'free': { dailyReplies: 50 },
  'pro': { dailyReplies: 500 },
  'business': { dailyReplies: Infinity }
};

export const rateLimitService = {
  
  // Short-term Rate Limiting (Token Bucket / Sliding Window)
  checkRateLimit: (userId: string, action: 'publish_post' | 'auto_reply' | 'api_call'): boolean => {
    const now = Date.now();
    const key = `${userId}:${action}`;
    const limit = LIMITS[action];

    const record = limitStore[key] || { count: 0, windowStart: now };

    if (now - record.windowStart > limit.window) {
      // Reset window
      record.count = 1;
      record.windowStart = now;
    } else {
      record.count++;
    }

    limitStore[key] = record;

    if (record.count > limit.max) {
      console.warn(`[RateLimit] ${userId} exceeded ${action} limit (${record.count}/${limit.max})`);
      storageService.logSpamProtection(userId, 'rate_limit', { action, limit: limit.max });
      return false;
    }

    return true;
  },

  // Daily Plan Quota
  checkPlanQuota: (user: User, action: 'auto_reply'): boolean => {
    if (action !== 'auto_reply') return true;

    const today = new Date().toISOString().split('T')[0];
    const key = `${user.id}:${today}:${action}`;
    const count = quotaStore[key] || 0;
    const max = PLAN_QUOTAS[user.plan].dailyReplies;

    if (count >= max) {
      console.warn(`[Quota] ${user.id} exceeded daily ${action} quota (${count}/${max})`);
      return false;
    }

    return true;
  },

  incrementQuota: (userId: string, action: 'auto_reply') => {
    const today = new Date().toISOString().split('T')[0];
    const key = `${userId}:${today}:${action}`;
    quotaStore[key] = (quotaStore[key] || 0) + 1;
  },

  getDailyUsage: (userId: string): number => {
      const today = new Date().toISOString().split('T')[0];
      const key = `${userId}:${today}:auto_reply`;
      return quotaStore[key] || 0;
  }
};